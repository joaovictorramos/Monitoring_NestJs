import { CreateMatterHandler } from './create/CreateMatter.handler';
import { DeleteMatterHandler } from './delete/deleteMatter.handler';
import { UpdateMatterHandler } from './update/updateMatter.handler';

export const CommandHandlers = [
  CreateMatterHandler,
  UpdateMatterHandler,
  DeleteMatterHandler,
];
