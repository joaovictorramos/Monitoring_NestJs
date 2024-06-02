import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateClassroomCommand {
  @IsString()
  idPath: string;

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
