import { Injectable, NestMiddleware, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

// verglichen mit einem Interceptor wird eine Middleware VOR den Guards aufgerufen (was wir hier brauchen),
// während ein Interceptor nach den Guards aufgerufen wird.
// Da wir aber das currentUser Attribut in den guards brauchen,
// benötigen wir hier eine Middleware.
@UseGuards(AuthGuard)
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      console.log(`set currentUser to`, user);
      req.currentUser = user;
    }
    next();
  }
}
