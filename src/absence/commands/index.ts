import { CreateAbsenceHandler } from './create/createAbsence.handler';
import { DeleteAbsenceHandler } from './delete/deleteAbsence.handler';
import { UpdateAbsenceHandler } from './update/updateAbsence.handler';

export const CommandHandlers = [
  CreateAbsenceHandler,
  UpdateAbsenceHandler,
  DeleteAbsenceHandler,
];
