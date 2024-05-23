import { IsOptional, IsString } from 'class-validator';

export class UpdateMonitorDto {
  @IsOptional()
  @IsString()
  readonly registration?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly actualPeriod?: string;

  @IsOptional()
  @IsString()
  readonly institutionalEmail?: string;

  @IsOptional()
  @IsString()
  readonly typeOfMonitoring?: string;

  @IsOptional()
  @IsString()
  readonly daysOfTheWeek?: string;

  @IsOptional()
  @IsString()
  readonly startHour?: string;

  @IsOptional()
  @IsString()
  readonly endHour?: string;
}