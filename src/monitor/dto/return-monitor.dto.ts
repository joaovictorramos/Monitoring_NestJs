import { ClassroomReturnDto } from 'src/classroom/dto/return-classroom.dto';
import { DaysOfTheWeekReturnDto } from 'src/days-of-the-week/dto/return-days-of-the-week.dto';
import { MatterReturnDto } from 'src/matter/dto/return-matter.dto';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';

export class MonitorReturnDto {
  id: string;
  registration: string;
  name: string;
  actualPeriod: number;
  institutionalEmail: string;
  typeOfMonitoring: string;
  startHour: string;
  endHour: string;
  usersId?: UsersReturnDto;
  classroomId?: ClassroomReturnDto;
  matterId?: MatterReturnDto;
  daysOfTheWeekIds?: DaysOfTheWeekReturnDto[];
}
