import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMatterCommand } from './CreateMatter.command';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyExistsException,
  InvalidRoleException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(CreateMatterCommand)
export class CreateMatterHandler
  implements ICommandHandler<CreateMatterCommand, MatterEntity | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async execute(command: CreateMatterCommand): Promise<MatterEntity> {
    const existingMatter = await this.matterRepository.findOne({
      where: {
        name: command.name,
      },
    });
    if (existingMatter) {
      throw new AlreadyExistsException(
        'Matter with the same name already exists',
      );
    }

    if (command.type !== undefined) {
      const typeList = ['OBRIGATÓRIA', 'OPTATIVA'];
      if (!typeList.includes(command.type)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "OBRIGATÓRIA" or "OPTATIVA"',
        );
      }
    }

    if (command.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(command.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA=FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }

    const matter = new MatterEntity();
    const id = uuidv4();

    matter.id = id;
    matter.name = command.name;
    matter.teacher = command.teacher;
    matter.type = command.type;
    matter.period = command.period;
    matter.startHour = command.startHour;
    matter.endHour = command.endHour;
    matter.daysOfTheWeek = command.daysOfTheWeek;
    return await this.matterRepository.save(matter);
  }
}
