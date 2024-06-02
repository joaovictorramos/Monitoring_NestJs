import { IsString } from 'class-validator';

export class FindByIdMonitorQuery {
  @IsString()
  idPath: string;
}
