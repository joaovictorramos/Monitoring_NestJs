import { IsOptional, IsString } from 'class-validator';

export class UpdateAbsenceDto {
  @IsOptional()
  @IsString()
  readonly date: string;

  @IsOptional()
  @IsString()
  readonly justification: string;

  @IsOptional()
  @IsString()
  readonly monitorId: string;
}
