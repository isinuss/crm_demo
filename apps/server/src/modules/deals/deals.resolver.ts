import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DealEntity } from '../../common/entities/deal.entity';
import { DealsService } from './deals.service';
import { CreateDealInput, UpdateDealInput } from '../../common/dto/inputs';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { DealStage } from '@shared/index';

@Resolver(() => DealEntity)
export class DealsResolver {
  constructor(private readonly dealsService: DealsService) {}

  @Query(() => [DealEntity])
  @UseGuards(GqlAuthGuard)
  async deals(
    @CurrentUser() user: JwtPayload,
    @Args('stage', { type: () => DealStage, nullable: true }) stage?: DealStage,
  ): Promise<DealEntity[]> {
    return this.dealsService.findAll(user.workspaceId, stage);
  }

  @Query(() => DealEntity)
  @UseGuards(GqlAuthGuard)
  async deal(@Args('id') id: string): Promise<DealEntity> {
    return this.dealsService.findOne(id);
  }

  @Query(() => [DealEntity])
  @UseGuards(GqlAuthGuard)
  async dealsByStage(
    @CurrentUser() user: JwtPayload,
    @Args('stage', { type: () => DealStage, nullable: true }) stage?: DealStage,
  ): Promise<DealEntity[]> {
    return this.dealsService.findAll(user.workspaceId, stage);
  }

  @Mutation(() => DealEntity)
  @UseGuards(GqlAuthGuard)
  async createDeal(
    @Args('input') input: CreateDealInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<DealEntity> {
    return this.dealsService.create(input, user.workspaceId, user.userId);
  }

  @Mutation(() => DealEntity)
  @UseGuards(GqlAuthGuard)
  async updateDeal(
    @Args('id') id: string,
    @Args('input') input: UpdateDealInput,
  ): Promise<DealEntity> {
    return this.dealsService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteDeal(@Args('id') id: string): Promise<boolean> {
    return this.dealsService.remove(id);
  }
}
