import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorEntity]),
    UsersModule,
    ClassroomModule,
    MatterModule,
    CachesModule,
    CqrsModule,
  ],
  controllers: [MonitorController],
  providers: [
    MonitorService,
    MonitorController,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [MonitorService, MonitorController],
})
export class MonitorModule {}
