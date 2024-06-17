import { DaysOfTheWeekReturnDto } from 'src/days-of-the-week/dto/return-days-of-the-week.dto';

export class MatterReturnDto {
  id: string;
  name: string;
  teacher: string;
  type: string;
  period: number;
  startHour: string;
  endHour: string;
  daysOfTheWeekId: DaysOfTheWeekReturnDto;
}
