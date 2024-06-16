import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDaysOfTheWeekCommand } from './updateDaysOfTheWeek.command';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(UpdateDaysOfTheWeekCommand)
export class UpdateDaysOfTheWeekHandler
  implements
    ICommandHandler<
      Partial<UpdateDaysOfTheWeekCommand>,
      DaysOfTheWeekEntity | null
    >
{
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(
    command: Partial<UpdateDaysOfTheWeekCommand>,
  ): Promise<DaysOfTheWeekEntity> {
    const daysOfTheWeek = await this.daysOfTheWeekRepository.findOne({
      where: { id: command.idPath },
    });

    if (!daysOfTheWeek) {
      throw new NotFoundException('No days of the week found');
    }

    if (!command.daysWeek && command.daysWeek !== undefined) {
      throw new MissingCredentialsException('DaysWeek cannot be null');
    }

    if (command.daysWeek !== undefined) {
      if (
        ![
          'DOMINGO',
          'SEGUNDA-FEIRA',
          'TERÇA-FEIRA',
          'QUARTA-FEIRA',
          'QUINTA-FEIRA',
          'SEXTA-FEIRA',
          'SÁBADO',
        ].includes(command.daysWeek)
      ) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "SÁBADO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO"',
        );
      }
    }
    Object.assign(daysOfTheWeek, command);
    return await this.daysOfTheWeekRepository.save(daysOfTheWeek);
  }
}
