import { MonitorEntity } from 'src/monitor/entities/monitor.entity';

export class AbsenceReturnDto {
  id: string;
  date: string;
  justification: string;
  monitors?: MonitorEntity;
}
