import { FindAllClassroomHandler } from './findAll/findAllClassroom.handler';
import { FindOneClassroomHandler } from './findOne/findOneClassroom.handler';
import { FindOnlyTrueStatusClassroomHandler } from './findOnlyTrueStatus/findOnlyTrueStatusClassroom.handler';

export const QueryHandlers = [
  FindAllClassroomHandler,
  FindOneClassroomHandler,
  FindOnlyTrueStatusClassroomHandler,
];
