import { CreateUsersHandler } from './create/createUsers.handler';
import { DeleteUsersHandler } from './delete/deleteUsers.handler';
import { UpdateUsersHandler } from './update/updateUsers.handler';

export const CommandHandlers = [
  CreateUsersHandler,
  UpdateUsersHandler,
  DeleteUsersHandler,
];
