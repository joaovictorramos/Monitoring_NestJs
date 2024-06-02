import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/user.entity';
import { ClassroomModule } from './classroom/classroom.module';
import { ClassroomEntity } from './classroom/entities/classroom.entity';
import { MonitorModule } from './monitor/monitor.module';
import { MonitorEntity } from './monitor/entities/monitor.entity';
import { MatterModule } from './matter/matter.module';
import { MatterEntity } from './matter/entities/matter.entity';
import { AbsenceModule } from './absence/absence.module';
import { AbsenceEntity } from './absence/entities/absence.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CachesModule } from './caches/caches.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        UsersEntity,
        ClassroomEntity,
        MonitorEntity,
        MatterEntity,
        AbsenceEntity,
      ],
      synchronize: false,
    }),
    UsersModule,
    ClassroomModule,
    MonitorModule,
    MatterModule,
    AbsenceModule,
    AuthModule,
    CachesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users', 'monitor', 'classroom', 'absence', 'matter');
  }
}
