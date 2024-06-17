/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMonitorQuery } from './findOneMonitor.query';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { MonitorReturnDto } from 'src/monitor/dto/return-monitor.dto';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';
import { ClassroomReturnDto } from 'src/classroom/dto/return-classroom.dto';
import { MatterReturnDto } from 'src/matter/dto/return-matter.dto';
import { DaysOfTheWeekReturnDto } from 'src/days-of-the-week/dto/return-days-of-the-week.dto';

@QueryHandler(FindOneMonitorQuery)
export class FindOneMonitorHandler
  implements IQueryHandler<FindOneMonitorQuery, MonitorReturnDto | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
  ) {}

  async execute(query: FindOneMonitorQuery): Promise<MonitorReturnDto> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: query.id },
      relations: [
        'usersId',
        'classroomId',
        'matterId',
        'matterId.daysOfTheWeekId',
        'daysOfTheWeekIds',
      ],
    });
    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    const monitorReturnDto: MonitorReturnDto = {
      id: monitor.id,
      registration: monitor.registration,
      name: monitor.name,
      actualPeriod: monitor.actualPeriod,
      institutionalEmail: monitor.institutionalEmail,
      typeOfMonitoring: monitor.typeOfMonitoring,
      startHour: monitor.startHour,
      endHour: monitor.endHour,
      usersId: monitor.usersId
        ? {
            id: monitor.usersId.id,
            name: monitor.usersId.name,
            login: monitor.usersId.login,
            password: monitor.usersId.password,
            office: monitor.usersId.office,
          }
        : null,
      classroomId: monitor.classroomId
        ? {
            id: monitor.classroomId.id,
            name: monitor.classroomId.name,
            block: monitor.classroomId.block,
            type: monitor.classroomId.type,
          }
        : null,
      matterId: monitor.matterId
        ? {
            id: monitor.matterId.id,
            name: monitor.matterId.name,
            teacher: monitor.matterId.teacher,
            type: monitor.matterId.type,
            period: monitor.matterId.period,
            startHour: monitor.matterId.startHour,
            endHour: monitor.matterId.endHour,
            daysOfTheWeekId: monitor.matterId.daysOfTheWeekId
              ? {
                  id: monitor.matterId.daysOfTheWeekId.id,
                  daysWeek: monitor.matterId.daysOfTheWeekId.daysWeek,
                }
              : null,
          }
        : null,
      daysOfTheWeekIds: monitor.daysOfTheWeekIds
        ? monitor.daysOfTheWeekIds.map((day) => ({
            id: day.id,
            daysWeek: day.daysWeek,
          }))
        : [],
    };
    return monitorReturnDto;
  }
}
