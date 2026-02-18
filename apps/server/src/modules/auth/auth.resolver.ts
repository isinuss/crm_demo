import { Resolver, Mutation, Query, Args, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../../common/entities/user.entity';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator';

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => UserEntity)
  user!: UserEntity;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ): Promise<AuthPayload> {
    return this.authService.register(email, password, firstName, lastName);
  }

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    return this.authService.login(email, password);
  }

  @Query(() => UserEntity)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() currentUser: JwtPayload): Promise<UserEntity> {
    return this.authService.me(currentUser.userId);
  }
}
