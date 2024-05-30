import { Module } from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { AbsenceController } from './absence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsenceEntity } from './entities/absence.entity';
import { MonitorModule } from 'src/monitor/monitor.module';
import { CachesModule } from 'src/caches/caches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AbsenceEntity]),
    MonitorModule,
    CachesModule,
  ],
  controllers: [AbsenceController],
  providers: [AbsenceService],
})
export class AbsenceModule {}
