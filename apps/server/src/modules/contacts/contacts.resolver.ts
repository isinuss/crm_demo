import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContactEntity } from '../../common/entities/contact.entity';
import { ContactsService } from './contacts.service';
import { CreateContactInput, UpdateContactInput } from '../../common/dto/inputs';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';
import { LifecycleStage } from '@shared/index';

@Resolver(() => ContactEntity)
export class ContactsResolver {
  constructor(private readonly contactsService: ContactsService) {}

  @Query(() => [ContactEntity])
  @UseGuards(GqlAuthGuard)
  async contacts(
    @CurrentUser() user: JwtPayload,
    @Args('search', { nullable: true }) search?: string,
    @Args('lifecycleStage', { type: () => LifecycleStage, nullable: true })
    lifecycleStage?: LifecycleStage,
  ): Promise<ContactEntity[]> {
    return this.contactsService.findAll(user.workspaceId, search, lifecycleStage);
  }

  @Query(() => ContactEntity)
  @UseGuards(GqlAuthGuard)
  async contact(@Args('id') id: string): Promise<ContactEntity> {
    return this.contactsService.findOne(id);
  }

  @Mutation(() => ContactEntity)
  @UseGuards(GqlAuthGuard)
  async createContact(
    @Args('input') input: CreateContactInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<ContactEntity> {
    return this.contactsService.create(input, user.workspaceId, user.userId);
  }

  @Mutation(() => ContactEntity)
  @UseGuards(GqlAuthGuard)
  async updateContact(
    @Args('id') id: string,
    @Args('input') input: UpdateContactInput,
  ): Promise<ContactEntity> {
    return this.contactsService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteContact(@Args('id') id: string): Promise<boolean> {
    return this.contactsService.remove(id);
  }
}
