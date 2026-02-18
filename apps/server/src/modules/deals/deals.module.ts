import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealEntity } from '../../common/entities/deal.entity';
import { DealsService } from './deals.service';
import { DealsResolver } from './deals.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([DealEntity])],
  providers: [DealsService, DealsResolver],
  exports: [DealsService],
})
export class DealsModule {}
