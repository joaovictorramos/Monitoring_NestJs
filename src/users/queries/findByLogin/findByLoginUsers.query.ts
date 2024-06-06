import { IsString } from 'class-validator';

export class FindByLoginUsersQuery {
  @IsString()
  readonly login: string;
}
