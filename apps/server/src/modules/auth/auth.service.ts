import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../common/entities/user.entity';
import { WorkspaceEntity } from '../../common/entities/workspace.entity';
import { UserRole } from '@shared/index';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create a workspace for the user
    const slug = email.split('@')[0] + '-workspace';
    const workspace = this.workspaceRepository.create({
      name: `${firstName}'s Workspace`,
      slug,
    });
    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
      workspaceId: savedWorkspace.id,
    });
    const savedUser = await this.userRepository.save(user);

    const token = this.jwtService.sign({
      userId: savedUser.id,
      workspaceId: savedUser.workspaceId,
      role: savedUser.role,
    });

    return { token, user: savedUser };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: UserEntity }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      workspaceId: user.workspaceId,
      role: user.role,
    });

    return { token, user };
  }

  async me(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
