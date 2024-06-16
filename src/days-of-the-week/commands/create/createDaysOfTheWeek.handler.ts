import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDaysOfTheWeekCommand } from './createDaysOfTheWeek.command';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyExistsException,
  InvalidRoleException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(CreateDaysOfTheWeekCommand)
export class CreateDaysOfTheWeekHandler
  implements
    ICommandHandler<CreateDaysOfTheWeekCommand, DaysOfTheWeekEntity | null>
{
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(
    command: CreateDaysOfTheWeekCommand,
  ): Promise<DaysOfTheWeekEntity> {
    const existingDaysOfTheWeek = await this.daysOfTheWeekRepository.findOne({
      where: { daysWeek: command.daysWeek },
    });
    if (existingDaysOfTheWeek) {
      throw new AlreadyExistsException(
        'Days of the week with the same day already exists',
      );
    }

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
        'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO"',
      );
    }

    const daysOfTheWeek = new DaysOfTheWeekEntity();
    const id = uuidv4();

    daysOfTheWeek.id = id;
    daysOfTheWeek.daysWeek = command.daysWeek;
    return await this.daysOfTheWeekRepository.save(daysOfTheWeek);
  }
}
