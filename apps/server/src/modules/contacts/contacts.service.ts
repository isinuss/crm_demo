import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ContactEntity } from '../../common/entities/contact.entity';
import { CreateContactInput, UpdateContactInput } from '../../common/dto/inputs';
import { LifecycleStage } from '@shared/index';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async findAll(
    workspaceId: string,
    search?: string,
    lifecycleStage?: LifecycleStage,
  ): Promise<ContactEntity[]> {
    const where: Record<string, unknown> = { workspaceId };

    if (lifecycleStage) {
      where.lifecycleStage = lifecycleStage;
    }

    if (search) {
      // Search by first name, last name, or email
      const results = await this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.company', 'company')
        .where('contact.workspaceId = :workspaceId', { workspaceId })
        .andWhere(
          '(contact.firstName LIKE :search OR contact.lastName LIKE :search OR contact.email LIKE :search)',
          { search: `%${search}%` },
        )
        .andWhere(lifecycleStage ? 'contact.lifecycleStage = :lifecycleStage' : '1=1', {
          lifecycleStage,
        })
        .orderBy('contact.createdAt', 'DESC')
        .getMany();
      return results;
    }

    return this.contactRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['company'],
    });
  }

  async findOne(id: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async create(
    input: CreateContactInput,
    workspaceId: string,
    userId: string,
  ): Promise<ContactEntity> {
    const contact = this.contactRepository.create({
      ...input,
      workspaceId,
      createdBy: userId,
    });
    return this.contactRepository.save(contact);
  }

  async update(id: string, input: UpdateContactInput): Promise<ContactEntity> {
    const contact = await this.findOne(id);
    Object.assign(contact, input);
    return this.contactRepository.save(contact);
  }

  async remove(id: string): Promise<boolean> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
    return true;
  }

  async count(workspaceId: string): Promise<number> {
    return this.contactRepository.count({ where: { workspaceId } });
  }
}
