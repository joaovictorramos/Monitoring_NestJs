export class CreateMonitorDto {
  readonly registration: string;
  readonly name: string;
  readonly actualPeriod: number;
  readonly institutionalEmail: string;
  readonly typeOfMonitoring: string;
  readonly daysOfTheWeek: string;
  readonly startHour: Date;
  readonly endHour: Date;
  readonly usersId: string;
  readonly classroomId: string;
}
