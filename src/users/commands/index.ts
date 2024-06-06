import { CreateUsersHandler } from './create/createUsers.handler';
import { DeleteUsersHandler } from './delete/deleteUsers.handler';
import { UpdateUsersHandler } from './update/updateUsers.handler';
import { UpdatePasswordByLoginUsersHandler } from './updatePasswordByEmail/updatePasswordByLoginUsers.handler';

export const CommandHandlers = [
  CreateUsersHandler,
  UpdateUsersHandler,
  DeleteUsersHandler,
  UpdatePasswordByLoginUsersHandler,
];
