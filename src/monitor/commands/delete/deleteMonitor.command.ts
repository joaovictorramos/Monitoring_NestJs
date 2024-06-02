import { IsString } from 'class-validator';

export class DeleteMonitorCommand {
  @IsString()
  idPath: string;
}
