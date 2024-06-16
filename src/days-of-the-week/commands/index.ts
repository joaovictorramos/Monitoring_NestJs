import { CreateDaysOfTheWeekHandler } from './create/createDaysOfTheWeek.handler';
import { DeleteDaysOfTheWeekHandler } from './delete/deleteDaysOfTheWeek.handler';
import { UpdateDaysOfTheWeekHandler } from './update/updateDaysOfTheWeek.handler';

export const CommandHandlers = [
  CreateDaysOfTheWeekHandler,
  UpdateDaysOfTheWeekHandler,
  DeleteDaysOfTheWeekHandler,
];
