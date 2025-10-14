import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    if (!request.currentUser) {
      console.log('No user defined');
      return false;
    }
    console.log(`User admin=${request.currentUser.admin}`);
    return request.currentUser.admin;
  }
}
