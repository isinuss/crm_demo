import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../../common/entities/company.entity';
import { CreateCompanyInput, UpdateCompanyInput } from '../../common/dto/inputs';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAll(workspaceId: string, search?: string): Promise<CompanyEntity[]> {
    if (search) {
      return this.companyRepository
        .createQueryBuilder('company')
        .where('company.workspaceId = :workspaceId', { workspaceId })
        .andWhere(
          '(company.name LIKE :search OR company.industry LIKE :search)',
          { search: `%${search}%` },
        )
        .orderBy('company.createdAt', 'DESC')
        .getMany();
    }

    return this.companyRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return company;
  }

  async create(
    input: CreateCompanyInput,
    workspaceId: string,
    userId: string,
  ): Promise<CompanyEntity> {
    const company = this.companyRepository.create({
      ...input,
      workspaceId,
      createdBy: userId,
    });
    return this.companyRepository.save(company);
  }

  async update(id: string, input: UpdateCompanyInput): Promise<CompanyEntity> {
    const company = await this.findOne(id);
    Object.assign(company, input);
    return this.companyRepository.save(company);
  }

  async remove(id: string): Promise<boolean> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company);
    return true;
  }

  async count(workspaceId: string): Promise<number> {
    return this.companyRepository.count({ where: { workspaceId } });
  }
}
