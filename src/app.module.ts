import { Module } from '@nestjs/common';
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
        ClassroomEntity,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
