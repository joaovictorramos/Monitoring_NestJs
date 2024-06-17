export class CreateMonitorDto {
  readonly registration: string;
  readonly name: string;
  readonly actualPeriod: number;
  readonly institutionalEmail: string;
  readonly typeOfMonitoring: string;
  readonly startHour: string;
  readonly endHour: string;
  readonly usersId: string;
  readonly classroomId: string;
  readonly matterId: string;
  readonly daysOfTheWeekIds: string[];
}
