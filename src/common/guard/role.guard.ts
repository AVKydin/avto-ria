import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userWithRole = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    const userRole: any = userWithRole?.role.role;

    let allowedRoles = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );
    if (!allowedRoles) {
      allowedRoles = this.reflector.get<string[]>('role', context.getClass());
      if (!allowedRoles) {
        return true;
      }
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
