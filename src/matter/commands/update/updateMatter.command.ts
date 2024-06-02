import { IsOptional, IsString } from 'class-validator';

export class UpdateMatterCommand {
  @IsString()
  idPath: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly teacher?: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsString()
  readonly period?: number;

  @IsOptional()
  @IsString()
  readonly startHour?: string;

  @IsOptional()
  @IsString()
  readonly endHour?: string;

  @IsOptional()
  @IsString()
  readonly daysOfTheWeek?: string;
}
