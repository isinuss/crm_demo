import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@ObjectType('Workspace')
@Entity('workspaces')
export class WorkspaceEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ unique: true })
  slug!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
