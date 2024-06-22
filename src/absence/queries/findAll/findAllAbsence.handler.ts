/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllAbsenceQuery } from './findAllAbsence.query';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { Logger } from '@nestjs/common';

@QueryHandler(FindAllAbsenceQuery)
export class FindAllAbsenceHandler
  implements IQueryHandler<FindAllAbsenceQuery, Array<AbsenceEntity> | null>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}

  async execute(query: FindAllAbsenceQuery): Promise<Array<AbsenceEntity>> {
    const absence = await this.absenceRepository.find({
      relations: ['monitorId'],
    });
    if (!absence.length) {
      throw new NotFoundException('No absences found');
    }
    return absence;
  }
}
