import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../../common/entities/user.entity';
import { WorkspaceEntity } from '../../common/entities/workspace.entity';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WorkspaceEntity]),
    JwtModule.register({
      global: true,
      secret: 'crm-demo-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
