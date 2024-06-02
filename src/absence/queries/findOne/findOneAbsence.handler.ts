/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneAbsenceQuery } from './findOneAbsence.query';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { AbsenceReturnDto } from 'src/absence/dto/return-absence.dto';
import { MonitorController } from 'src/monitor/monitor.controller';
import { Logger } from '@nestjs/common';

@QueryHandler(FindOneAbsenceQuery)
export class FindOneAbsenceHandler
  implements IQueryHandler<FindOneAbsenceQuery, AbsenceReturnDto | null>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
    private readonly monitorController: MonitorController,
  ) {}

  async execute(query: FindOneAbsenceQuery): Promise<AbsenceReturnDto> {
    const absence = await this.absenceRepository.findOne({
      where: { id: query.id },
      relations: ['monitorId'],
    });
    if (!absence) {
      throw new NotFoundException('No absence found');
    }

    const absenceReturnDto: AbsenceReturnDto = {
      id: absence.id,
      date: absence.date,
      justification: absence.justification,
    };

    if (absence.monitorId) {
      const monitor = await this.monitorController.findById(
        absence.monitorId.id,
      );
      absenceReturnDto.monitors = monitor;
    }
    return absenceReturnDto;
  }
}
