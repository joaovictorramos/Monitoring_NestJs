import { IsString } from 'class-validator';

export class DeleteDaysOfTheWeekCommand {
  @IsString()
  idPath: string;
}
