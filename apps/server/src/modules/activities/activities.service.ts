import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from '../../common/entities/activity.entity';
import { CreateActivityInput } from '../../common/dto/inputs';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepository: Repository<ActivityEntity>,
  ) {}

  async findAll(workspaceId: string): Promise<ActivityEntity[]> {
    return this.activityRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      relations: ['contact', 'company', 'deal', 'user'],
    });
  }

  async findOne(id: string): Promise<ActivityEntity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['contact', 'company', 'deal', 'user'],
    });
    if (!activity) {
      throw new NotFoundException(`Activity with id ${id} not found`);
    }
    return activity;
  }

  async create(
    input: CreateActivityInput,
    workspaceId: string,
    userId: string,
  ): Promise<ActivityEntity> {
    const activity = this.activityRepository.create({
      ...input,
      workspaceId,
      userId,
    });
    return this.activityRepository.save(activity);
  }

  async remove(id: string): Promise<boolean> {
    const activity = await this.findOne(id);
    await this.activityRepository.remove(activity);
    return true;
  }

  async recentActivities(
    workspaceId: string,
    limit: number = 10,
  ): Promise<ActivityEntity[]> {
    return this.activityRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['contact', 'company', 'deal', 'user'],
    });
  }

  async count(workspaceId: string): Promise<number> {
    return this.activityRepository.count({ where: { workspaceId } });
  }
}
