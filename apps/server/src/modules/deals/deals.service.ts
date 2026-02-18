import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealEntity } from '../../common/entities/deal.entity';
import { CreateDealInput, UpdateDealInput } from '../../common/dto/inputs';
import { DealStage } from '@shared/index';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealEntity)
    private readonly dealRepository: Repository<DealEntity>,
  ) {}

  async findAll(workspaceId: string, stage?: DealStage): Promise<DealEntity[]> {
    const where: Record<string, unknown> = { workspaceId };
    if (stage) {
      where.stage = stage;
    }
    return this.dealRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['contact', 'company', 'owner'],
    });
  }

  async findOne(id: string): Promise<DealEntity> {
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: ['contact', 'company', 'owner'],
    });
    if (!deal) {
      throw new NotFoundException(`Deal with id ${id} not found`);
    }
    return deal;
  }

  async create(
    input: CreateDealInput,
    workspaceId: string,
    userId: string,
  ): Promise<DealEntity> {
    const deal = this.dealRepository.create({
      ...input,
      workspaceId,
      ownerId: userId,
    });
    return this.dealRepository.save(deal);
  }

  async update(id: string, input: UpdateDealInput): Promise<DealEntity> {
    const deal = await this.findOne(id);
    Object.assign(deal, input);
    return this.dealRepository.save(deal);
  }

  async remove(id: string): Promise<boolean> {
    const deal = await this.findOne(id);
    await this.dealRepository.remove(deal);
    return true;
  }

  async count(workspaceId: string): Promise<number> {
    return this.dealRepository.count({ where: { workspaceId } });
  }

  async sumOpenDeals(workspaceId: string): Promise<number> {
    const result = await this.dealRepository
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.workspaceId = :workspaceId', { workspaceId })
      .andWhere('deal.stage NOT IN (:...closedStages)', {
        closedStages: [DealStage.CLOSED_WON, DealStage.CLOSED_LOST],
      })
      .getRawOne();
    return result?.total ? parseFloat(result.total) : 0;
  }

  async sumWonDeals(workspaceId: string): Promise<number> {
    const result = await this.dealRepository
      .createQueryBuilder('deal')
      .select('SUM(deal.value)', 'total')
      .where('deal.workspaceId = :workspaceId', { workspaceId })
      .andWhere('deal.stage = :stage', { stage: DealStage.CLOSED_WON })
      .getRawOne();
    return result?.total ? parseFloat(result.total) : 0;
  }
}
