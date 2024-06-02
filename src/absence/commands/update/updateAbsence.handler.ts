import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAbsenceCommand } from './updateAbsence.command';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(UpdateAbsenceCommand)
export class UpdateAbsenceHandler
  implements
    ICommandHandler<Partial<UpdateAbsenceCommand>, AbsenceEntity | null>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}

  async execute(
    command: Partial<UpdateAbsenceCommand>,
  ): Promise<AbsenceEntity> {
    const absence = await this.absenceRepository.findOne({
      where: { id: command.idPath },
    });
    if (!absence) {
      throw new NotFoundException('No absence found');
    }
    if (
      (!command.date && command.date !== undefined) ||
      (!command.monitorId && command.monitorId !== undefined)
    ) {
      throw new MissingCredentialsException('Date or monitor cannot be null');
    }

    Object.assign(absence, command);
    return await this.absenceRepository.save(absence);
  }
}
