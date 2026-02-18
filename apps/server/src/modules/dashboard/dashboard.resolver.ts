import { Resolver, Query, ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityEntity } from '../../common/entities/activity.entity';
import { DashboardService } from './dashboard.service';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ObjectType('DashboardStats')
export class DashboardStatsType {
  @Field(() => Int)
  totalContacts!: number;

  @Field(() => Int)
  totalCompanies!: number;

  @Field(() => Int)
  totalDeals!: number;

  @Field(() => Float)
  openDealsValue!: number;

  @Field(() => Float)
  wonDealsValue!: number;

  @Field(() => [ActivityEntity])
  recentActivities!: ActivityEntity[];
}

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardStatsType)
  @UseGuards(GqlAuthGuard)
  async dashboardStats(
    @CurrentUser() user: JwtPayload,
  ): Promise<DashboardStatsType> {
    return this.dashboardService.getStats(user.workspaceId);
  }
}
