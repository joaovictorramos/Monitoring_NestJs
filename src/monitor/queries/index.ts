import { FindAllMonitorHandler } from './findAll/findAllMonitor.handler';
import { FindByIdMonitorHandler } from './findById/findByIdMonitor.handler';
import { FindOneMonitorHandler } from './findOne/findOneMonitor.handler';

export const QueryHandlers = [
  FindAllMonitorHandler,
  FindOneMonitorHandler,
  FindByIdMonitorHandler,
];
