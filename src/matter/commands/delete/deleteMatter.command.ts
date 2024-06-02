import { IsString } from 'class-validator';

export class DeleteMatterCommand {
  @IsString()
  idPath: string;
}
