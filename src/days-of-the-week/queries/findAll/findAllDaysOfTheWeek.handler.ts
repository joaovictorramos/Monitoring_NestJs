/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllDaysOfTheWeekQuery } from './findAllDaysOfTheWeek.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';

@QueryHandler(FindAllDaysOfTheWeekQuery)
export class FindAllDaysOfTheWeekHandler
  implements
    IQueryHandler<FindAllDaysOfTheWeekQuery, Array<DaysOfTheWeekEntity> | null>
{
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(
    query: FindAllDaysOfTheWeekQuery,
  ): Promise<Array<DaysOfTheWeekEntity>> {
    const daysOfTheWeek = await this.daysOfTheWeekRepository.find();
    if (!daysOfTheWeek.length) {
      throw new NotFoundException('No days of the week found');
    }
    return daysOfTheWeek;
  }
}
