import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneDaysOfTheWeekQuery } from './findOneDaysOfTheWeek.query';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindOneDaysOfTheWeekQuery)
export class FindOneDaysOfTheWeekHandler
  implements
    IQueryHandler<FindOneDaysOfTheWeekQuery, DaysOfTheWeekEntity | null>
{
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(
    query: FindOneDaysOfTheWeekQuery,
  ): Promise<DaysOfTheWeekEntity> {
    const daysOfTheWeek = await this.daysOfTheWeekRepository.findOne({
      where: { id: query.id },
    });
    if (!daysOfTheWeek) {
      throw new NotFoundException('No days of the week found');
    }
    return daysOfTheWeek;
  }
}
