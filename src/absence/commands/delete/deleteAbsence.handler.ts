import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAbsenceCommand } from './deleteAbsence.command';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@CommandHandler(DeleteAbsenceCommand)
export class DeleteAbsenceHandler
  implements ICommandHandler<DeleteAbsenceCommand | null>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}

  async execute(command: DeleteAbsenceCommand): Promise<void> {
    const absence = await this.absenceRepository.delete(command.idPath);
    if (absence.affected === 0) {
      throw new NotFoundException('No absence found');
    }
  }
}
