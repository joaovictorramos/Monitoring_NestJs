import { FindAllUsersHandler } from './findAll/findAllUsers.handler';
import { FindByLoginUsersHandler } from './findByLogin/findByLoginUsers.handler';
import { FindOneUsersHandler } from './findOne/findOneUsers.handler';

export const QueryHandlers = [
  FindAllUsersHandler,
  FindOneUsersHandler,
  FindByLoginUsersHandler,
];
