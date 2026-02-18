import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LifecycleStage } from '@shared/index';
import { CompanyEntity } from './company.entity';

registerEnumType(LifecycleStage, { name: 'LifecycleStage' });

@ObjectType('Contact')
@Entity('contacts')
export class ContactEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  firstName!: string;

  @Field()
  @Column()
  lastName!: string;

  @Field()
  @Column()
  email!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  position?: string;

  @Field(() => LifecycleStage)
  @Column({
    type: 'varchar',
    default: LifecycleStage.LEAD,
  })
  lifecycleStage!: LifecycleStage;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Field()
  @Column()
  workspaceId!: string;

  @Field()
  @Column()
  createdBy!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  companyId?: string;

  @Field(() => CompanyEntity, { nullable: true })
  @ManyToOne(() => CompanyEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'companyId' })
  company?: CompanyEntity;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
