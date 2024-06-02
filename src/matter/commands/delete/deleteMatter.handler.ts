import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMatterCommand } from './deleteMatter.command';
import { InjectRepository } from '@nestjs/typeorm';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@CommandHandler(DeleteMatterCommand)
export class DeleteMatterHandler
  implements ICommandHandler<DeleteMatterCommand | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async execute(command: DeleteMatterCommand): Promise<void> {
    const matter = await this.matterRepository.delete(command.idPath);
    if (matter.affected === 0) {
      throw new NotFoundException('No matter found');
    }
  }
}
