import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType('Company')
@Entity('companies')
export class CompanyEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Field()
  @Column()
  workspaceId!: string;

  @Field()
  @Column()
  createdBy!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
