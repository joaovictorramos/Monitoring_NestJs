import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsenceEntity } from './entities/absence.entity';
import { MonitorModule } from 'src/monitor/monitor.module';
import { CachesModule } from 'src/caches/caches.module';
import { QueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsenceEntity]),
    MonitorModule,
    CachesModule,
    CqrsModule,
  ],
  controllers: [AbsenceController],
  providers: [AbsenceService, ...QueryHandlers],
})
export class AbsenceModule {}
