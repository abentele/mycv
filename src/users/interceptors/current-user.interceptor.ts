import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }
    return next.handle();
  }
}
