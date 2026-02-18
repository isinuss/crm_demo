import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
