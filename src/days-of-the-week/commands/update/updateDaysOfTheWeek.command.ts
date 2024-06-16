import { IsOptional, IsString } from 'class-validator';

export class UpdateDaysOfTheWeekCommand {
  @IsString()
  idPath: string;

  @IsOptional()
  @IsString()
  readonly daysWeek?: string;
}
