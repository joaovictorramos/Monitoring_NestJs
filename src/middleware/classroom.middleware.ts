/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

export class IsReservedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body.isReserved == null || req.body.isReserved == undefined) {
      req.body.isReserved = false;
    }
    next();
  }
}
