import { Module } from '@nestjs/common';
import { AbsenceController } from './absence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsenceEntity } from './entities/absence.entity';
import { MonitorModule } from 'src/monitor/monitor.module';
import { CachesModule } from 'src/caches/caches.module';
import { QueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsenceEntity]),
    MonitorModule,
    CachesModule,
    CqrsModule,
  ],
  controllers: [AbsenceController],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class AbsenceModule {}
