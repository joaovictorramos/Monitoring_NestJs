import { IsString } from 'class-validator';

export class DaysOfTheWeekUpdateDto {
  @IsString()
  readonly daysWeek: string;
}
