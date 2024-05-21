import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly block?: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsBoolean()
  readonly isReserved?: string;
}
