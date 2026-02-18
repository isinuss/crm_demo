import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityEntity } from '../../common/entities/activity.entity';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from '../../common/dto/inputs';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@Resolver(() => ActivityEntity)
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Query(() => [ActivityEntity])
  @UseGuards(GqlAuthGuard)
  async activities(@CurrentUser() user: JwtPayload): Promise<ActivityEntity[]> {
    return this.activitiesService.findAll(user.workspaceId);
  }

  @Query(() => ActivityEntity)
  @UseGuards(GqlAuthGuard)
  async activity(@Args('id') id: string): Promise<ActivityEntity> {
    return this.activitiesService.findOne(id);
  }

  @Query(() => [ActivityEntity])
  @UseGuards(GqlAuthGuard)
  async recentActivities(
    @CurrentUser() user: JwtPayload,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit?: number,
  ): Promise<ActivityEntity[]> {
    return this.activitiesService.recentActivities(user.workspaceId, limit);
  }

  @Mutation(() => ActivityEntity)
  @UseGuards(GqlAuthGuard)
  async createActivity(
    @Args('input') input: CreateActivityInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<ActivityEntity> {
    return this.activitiesService.create(input, user.workspaceId, user.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteActivity(@Args('id') id: string): Promise<boolean> {
    return this.activitiesService.remove(id);
  }
}
