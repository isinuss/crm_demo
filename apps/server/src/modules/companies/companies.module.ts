import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../../common/entities/company.entity';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  providers: [CompaniesService, CompaniesResolver],
  exports: [CompaniesService],
})
export class CompaniesModule {}
