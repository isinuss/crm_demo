import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DealStage } from '@shared/index';
import { ContactEntity } from './contact.entity';
import { CompanyEntity } from './company.entity';
import { UserEntity } from './user.entity';

registerEnumType(DealStage, { name: 'DealStage' });

@ObjectType('Deal')
@Entity('deals')
export class DealEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field(() => Float)
  @Column({ type: 'decimal', default: 0 })
  value!: number;

  @Field()
  @Column({ default: 'USD' })
  currency!: string;

  @Field(() => DealStage)
  @Column({
    type: 'varchar',
    default: DealStage.PROSPECTING,
  })
  stage!: DealStage;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  probability!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  expectedCloseDate?: string;

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
  ownerId?: string;

  @Field(() => UserEntity, { nullable: true })
  @ManyToOne(() => UserEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner?: UserEntity;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
