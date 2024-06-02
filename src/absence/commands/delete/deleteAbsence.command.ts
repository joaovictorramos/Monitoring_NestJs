import { IsString } from 'class-validator';

export class DeleteAbsenceCommand {
  @IsString()
  idPath: string;
}
