import { IsOptional, IsString } from 'class-validator';

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
}
