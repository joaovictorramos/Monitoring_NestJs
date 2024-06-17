import { forwardRef, Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { UsersModule } from 'src/users/users.module';
import { ClassroomModule } from 'src/classroom/classroom.module';
import { MatterModule } from 'src/matter/matter.module';
import { CachesModule } from 'src/caches/caches.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { AbsenceModule } from 'src/absence/absence.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorEntity, DaysOfTheWeekEntity]),
    UsersModule,
    ClassroomModule,
    MatterModule,
    forwardRef(() => AbsenceModule),
    CachesModule,
    CqrsModule,
  ],
  controllers: [MonitorController],
  providers: [MonitorController, ...QueryHandlers, ...CommandHandlers],
  exports: [MonitorController, TypeOrmModule],
})
export class MonitorModule {}
