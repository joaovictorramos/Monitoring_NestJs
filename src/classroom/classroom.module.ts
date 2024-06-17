import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomController } from './classroom.controller';
import { CachesModule } from 'src/caches/caches.module';
import { IsReservedMiddleware } from 'src/middleware/classroom.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomEntity]),
    CachesModule,
    CqrsModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomController, ...QueryHandlers, ...CommandHandlers],
  exports: [ClassroomController],
})
export class ClassroomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsReservedMiddleware)
      .forRoutes({ path: 'absence', method: RequestMethod.POST });
  }
}
