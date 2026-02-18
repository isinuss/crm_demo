import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompanyEntity } from '../../common/entities/company.entity';
import { CompaniesService } from './companies.service';
import { CreateCompanyInput, UpdateCompanyInput } from '../../common/dto/inputs';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@Resolver(() => CompanyEntity)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [CompanyEntity])
  @UseGuards(GqlAuthGuard)
  async companies(
    @CurrentUser() user: JwtPayload,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<CompanyEntity[]> {
    return this.companiesService.findAll(user.workspaceId, search);
  }

  @Query(() => CompanyEntity)
  @UseGuards(GqlAuthGuard)
  async company(@Args('id') id: string): Promise<CompanyEntity> {
    return this.companiesService.findOne(id);
  }

  @Mutation(() => CompanyEntity)
  @UseGuards(GqlAuthGuard)
  async createCompany(
    @Args('input') input: CreateCompanyInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<CompanyEntity> {
    return this.companiesService.create(input, user.workspaceId, user.userId);
  }

  @Mutation(() => CompanyEntity)
  @UseGuards(GqlAuthGuard)
  async updateCompany(
    @Args('id') id: string,
    @Args('input') input: UpdateCompanyInput,
  ): Promise<CompanyEntity> {
    return this.companiesService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCompany(@Args('id') id: string): Promise<boolean> {
    return this.companiesService.remove(id);
  }
}
