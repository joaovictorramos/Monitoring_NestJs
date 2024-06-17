import { FindAllAbsenceHandler } from './findAll/findAllAbsence.handler';
import { FindByMonitorAbsenceHandler } from './findByMonitor/findByMonitorAbsence.handler';
import { FindOneAbsenceHandler } from './findOne/findOneAbsence.handler';

export const QueryHandlers = [
  FindAllAbsenceHandler,
  FindOneAbsenceHandler,
  FindByMonitorAbsenceHandler,
];
