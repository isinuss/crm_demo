import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../../common/entities/activity.entity';
import { ActivitiesService } from './activities.service';
import { ActivitiesResolver } from './activities.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  providers: [ActivitiesService, ActivitiesResolver],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
