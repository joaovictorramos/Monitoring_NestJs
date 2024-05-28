/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard extends AuthGuard {
  constructor(jwtService: JwtService, reflector: Reflector) {
    super(jwtService, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAllowed = await super.canActivate(context);
    if (!isAllowed) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const users = request.users;
    //Logger.log(users);
    return roles.includes(users.office);
  }
}
