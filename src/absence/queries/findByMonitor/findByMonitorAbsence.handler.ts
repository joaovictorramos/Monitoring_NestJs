/* eslint-disable @typescript-eslint/no-unused-vars */
import { MonitorController } from 'src/monitor/monitor.controller';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindByMonitorAbsenceQuery } from './findByMonitorAbsence.query';
import { AbsenceReturnDto } from 'src/absence/dto/return-absence.dto';
import { Repository } from 'typeorm';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { MonitorReturnDto } from 'src/monitor/dto/return-monitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindByMonitorAbsenceQuery)
export class FindByMonitorAbsenceHandler
  implements
    IQueryHandler<FindByMonitorAbsenceQuery, Array<AbsenceReturnDto> | null>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRespository: Repository<AbsenceEntity>,
    private readonly monitorController: MonitorController,
  ) {}

  async execute(
    query: FindByMonitorAbsenceQuery,
  ): Promise<Array<AbsenceReturnDto>> {
    const monitor = await this.monitorController.findOne(query.id);
    if (!monitor || monitor !== undefined) {
      if (monitor.id == query.id) {
        const absence = await this.absenceRespository.find({
          where: { monitorId: monitor },
          relations: ['monitorId'],
        });
        if (!absence) {
          throw new NotFoundException('No absence found');
        }
        return absence;
      }
      throw new NotFoundException('No monitor found');
    }
    throw new NotFoundException('No monitor found');
  }
}
