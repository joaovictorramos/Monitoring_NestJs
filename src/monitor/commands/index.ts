import { CreateMonitorHandler } from './create/createMonitor.handler';
import { DeleteMonitorHandler } from './delete/deleteMonitor.handler';
import { UpdateMonitorHandler } from './update/updateMonitor.handler';

export const CommandHandlers = [
  CreateMonitorHandler,
  UpdateMonitorHandler,
  DeleteMonitorHandler,
];
