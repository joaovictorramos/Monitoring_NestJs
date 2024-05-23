import { ClassroomReturnDto } from 'src/classroom/dto/return-classroom.dto';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';

export class MonitorReturnDto {
  id: string;
  registration: string;
  name: string;
  actualPeriod: number;
  institutionalEmail: string;
  typeOfMonitoring: string;
  daysOfTheWeek: string;
  startHour: Date;
  endHour: Date;
  users?: UsersReturnDto;
  classrooms?: ClassroomReturnDto;
}
