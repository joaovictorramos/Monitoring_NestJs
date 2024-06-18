import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMatterCommand } from './createMatter.command';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyExistsException,
  InvalidRoleException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { DaysOfTheWeekController } from 'src/days-of-the-week/days-of-the-week.controller';

@CommandHandler(CreateMatterCommand)
export class CreateMatterHandler
  implements ICommandHandler<CreateMatterCommand, MatterEntity | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
    private readonly daysOfTheWeekController: DaysOfTheWeekController,
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

    const existingDaysOfTheWeek = await this.daysOfTheWeekController.findOne(
      command.daysOfTheWeekId,
    );
    if (!existingDaysOfTheWeek) {
      throw new NotFoundException('No days of the week found');
    }

    if (command.type !== undefined) {
      const typeList = ['OBRIGATÓRIA', 'OPTATIVA'];
      if (!typeList.includes(command.type)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "OBRIGATÓRIA" or "OPTATIVA"',
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
    matter.daysOfTheWeekId = existingDaysOfTheWeek;
    return await this.matterRepository.save(matter);
  }
}
