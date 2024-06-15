import { IsOptional, IsString } from 'class-validator';

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
}
