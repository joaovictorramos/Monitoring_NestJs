import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMatterCommand } from './updateMatter.command';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { DaysOfTheWeekController } from 'src/days-of-the-week/days-of-the-week.controller';

@CommandHandler(UpdateMatterCommand)
export class UpdateMatterHandler
  implements ICommandHandler<Partial<UpdateMatterCommand>, MatterEntity | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
    private readonly daysOfTheWeekController: DaysOfTheWeekController,
  ) {}

  async execute(command: Partial<UpdateMatterCommand>): Promise<MatterEntity> {
    const matter = await this.matterRepository.findOne({
      where: { id: command.idPath },
    });
    if (!matter) {
      throw new NotFoundException('No matter found');
    }

    const existingDaysOfTheWeek = await this.daysOfTheWeekController.findOne(
      command.daysOfTheWeekId,
    );
    if (!existingDaysOfTheWeek) {
      throw new NotFoundException('No days of the week found');
    }

    if (
      (!command.name && command.name !== undefined) ||
      (!command.teacher && command.teacher !== undefined) ||
      (!command.type && command.type !== undefined) ||
      (!command.startHour && command.startHour !== undefined) ||
      (!command.endHour && command.endHour !== undefined) ||
      (!command.daysOfTheWeekId && command.daysOfTheWeekId !== undefined)
    ) {
      throw new MissingCredentialsException(
        'Invalid role value. Name, teacher, type, startHour, endHour and daysOfTheWeek cannot be null',
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
    Object.assign(matter, command);
    return await this.matterRepository.save(matter);
  }
}
