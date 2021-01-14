import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;

    if (!requiredRoles) {
      return true;
    }

    return userRole === requiredRoles;
  }
}
