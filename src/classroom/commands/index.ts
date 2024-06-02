import { CreateClassroomHandler } from './create/createClassroom.handler';
import { DeleteClassroomHandler } from './delete/deleteClassroom.handler';
import { UpdateClassroomHandler } from './update/updateClassroom.handler';

export const CommandHandlers = [
  CreateClassroomHandler,
  UpdateClassroomHandler,
  DeleteClassroomHandler,
];
