import { IsString } from 'class-validator';

export class DeleteClassroomCommand {
  @IsString()
  idPath: string;
}
