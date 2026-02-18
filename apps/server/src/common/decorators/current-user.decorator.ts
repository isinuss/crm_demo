import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtPayload {
  userId: string;
  workspaceId: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    return req.user as JwtPayload;
  },
);
