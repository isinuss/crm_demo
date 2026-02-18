import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { LifecycleStage, DealStage, ActivityType } from '@shared/index';

// ----------------------------------------------------------------------------
// Contact Inputs
// ----------------------------------------------------------------------------

@InputType()
export class CreateContactInput {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  position?: string;

  @Field(() => LifecycleStage, { nullable: true })
  lifecycleStage?: LifecycleStage;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class UpdateContactInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  position?: string;

  @Field(() => LifecycleStage, { nullable: true })
  lifecycleStage?: LifecycleStage;

  @Field({ nullable: true })
  companyId?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  notes?: string;
}

// ----------------------------------------------------------------------------
// Company Inputs
// ----------------------------------------------------------------------------

@InputType()
export class CreateCompanyInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}

// ----------------------------------------------------------------------------
// Deal Inputs
// ----------------------------------------------------------------------------

@InputType()
export class CreateDealInput {
  @Field()
  title!: string;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => DealStage, { nullable: true })
  stage?: DealStage;

  @Field(() => Int, { nullable: true })
  probability?: number;

  @Field({ nullable: true })
  contactId?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  expectedCloseDate?: string;
}

@InputType()
export class UpdateDealInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field(() => DealStage, { nullable: true })
  stage?: DealStage;

  @Field(() => Int, { nullable: true })
  probability?: number;

  @Field({ nullable: true })
  contactId?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  expectedCloseDate?: string;

  @Field({ nullable: true })
  ownerId?: string;
}

// ----------------------------------------------------------------------------
// Activity Inputs
// ----------------------------------------------------------------------------

@InputType()
export class CreateActivityInput {
  @Field(() => ActivityType)
  type!: ActivityType;

  @Field()
  subject!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  contactId?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  dealId?: string;

  @Field({ nullable: true })
  dueDate?: string;

  @Field({ nullable: true })
  completed?: boolean;
}
