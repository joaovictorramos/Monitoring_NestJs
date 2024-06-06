import { IsString } from 'class-validator';

export class UsersUpdatePasswordByLoginDto {
  @IsString()
  readonly login: string;

  @IsString()
  readonly newPassword: string;

  @IsString()
  readonly confirmPassword: string;
}
