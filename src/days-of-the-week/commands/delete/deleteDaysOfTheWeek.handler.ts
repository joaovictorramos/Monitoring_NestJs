import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDaysOfTheWeekCommand } from './deleteDaysOfTheWeek.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@CommandHandler(DeleteDaysOfTheWeekCommand)
export class DeleteDaysOfTheWeekHandler
  implements ICommandHandler<DeleteDaysOfTheWeekCommand | null>
{
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(command: DeleteDaysOfTheWeekCommand): Promise<void> {
    const daysOfTheWeek = await this.daysOfTheWeekRepository.delete(
      command.idPath,
    );
    if (daysOfTheWeek.affected === 0) {
      throw new NotFoundException('No days of the week found');
    }
  }
}
