import { IsOptional, IsString } from 'class-validator';

export class UpdateUsersCommand {
  @IsString()
  idPath: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly login?: string;

  @IsOptional()
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly office?: string;
}
