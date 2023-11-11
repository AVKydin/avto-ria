import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userRole = this.reflector.get<string[]>('role', context.getHandler());
    if (!userRole) {
      userRole = this.reflector.get<string[]>('city', context.getClass());
      if (!userRole) {
        return true;
      }
    }
    const user = request.user;

    // can write tour logic const announcement = carRepository.findOne({})

    if (!userRole.includes(user.role)) {
      throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
