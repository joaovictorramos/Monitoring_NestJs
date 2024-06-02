import { IsString } from 'class-validator';

export class DeleteUsersCommand {
  @IsString()
  idPath: string;
}
