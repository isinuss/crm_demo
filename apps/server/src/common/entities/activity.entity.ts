import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActivityType } from '@shared/index';
import { ContactEntity } from './contact.entity';
import { CompanyEntity } from './company.entity';
import { DealEntity } from './deal.entity';
import { UserEntity } from './user.entity';

registerEnumType(ActivityType, { name: 'ActivityType' });

@ObjectType('Activity')
@Entity('activities')
export class ActivityEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ActivityType)
  @Column({
    type: 'varchar',
  })
  type!: ActivityType;

  @Field()
  @Column()
  subject!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field()
  @Column({ default: false })
  completed!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dueDate?: string;

  @Field()
  @Column()
  workspaceId!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  contactId?: string;

  @Field(() => ContactEntity, { nullable: true })
  @ManyToOne(() => ContactEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'contactId' })
  contact?: ContactEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  companyId?: string;

  @Field(() => CompanyEntity, { nullable: true })
  @ManyToOne(() => CompanyEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'companyId' })
  company?: CompanyEntity;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dealId?: string;

  @Field(() => DealEntity, { nullable: true })
  @ManyToOne(() => DealEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'dealId' })
  deal?: DealEntity;

  @Field()
  @Column()
  userId!: string;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
