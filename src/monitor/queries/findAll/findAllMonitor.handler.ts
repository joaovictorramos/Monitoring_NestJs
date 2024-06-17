/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMonitorQuery } from './findAllMonitor.query';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { MonitorReturnDto } from 'src/monitor/dto/return-monitor.dto';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';
import { ClassroomReturnDto } from 'src/classroom/dto/return-classroom.dto';
import { MatterReturnDto } from 'src/matter/dto/return-matter.dto';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { DaysOfTheWeekCreateDto } from 'src/days-of-the-week/dto/create-days-of-the-week.dto';
import { DaysOfTheWeekReturnDto } from './../../../days-of-the-week/dto/return-days-of-the-week.dto';

@QueryHandler(FindAllMonitorQuery)
export class FindAllMonitorHandler
  implements IQueryHandler<FindAllMonitorQuery, Array<MonitorReturnDto> | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async execute(query: FindAllMonitorQuery): Promise<Array<MonitorReturnDto>> {
    const monitors = await this.monitorRepository.find({
      relations: [
        'usersId',
        'classroomId',
        'matterId',
        'matterId.daysOfTheWeekId',
        'daysOfTheWeekIds',
      ],
    });

    if (!monitors.length) {
      throw new NotFoundException('No monitors found');
    }

    return monitors.map((monitor) => {
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
    });
  }
}
