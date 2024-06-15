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
      relations: ['usersId', 'classroomId', 'matterId'],
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
      daysOfTheWeek: monitor.daysOfTheWeek,
      startHour: monitor.startHour,
      endHour: monitor.endHour,
    };

    if (monitor.usersId) {
      const usersReturnDto: UsersReturnDto = {
        id: monitor.usersId.id,
        name: monitor.usersId.name,
        login: monitor.usersId.login,
        password: monitor.usersId.password,
        office: monitor.usersId.office,
      };
      monitorReturnDto.usersId = usersReturnDto;
    }
    if (monitor.classroomId) {
      const classroomReturnDto: ClassroomReturnDto = {
        id: monitor.classroomId.id,
        name: monitor.classroomId.name,
        block: monitor.classroomId.block,
        type: monitor.classroomId.type,
      };
      monitorReturnDto.classroomId = classroomReturnDto;
    }
    if (monitor.matterId) {
      const matterReturnDto: MatterReturnDto = {
        id: monitor.matterId.id,
        name: monitor.matterId.name,
        teacher: monitor.matterId.teacher,
        type: monitor.matterId.type,
        period: monitor.matterId.period,
        startHour: monitor.matterId.startHour,
        endHour: monitor.matterId.endHour,
        daysOfTheWeek: monitor.matterId.daysOfTheWeek,
      };
      monitorReturnDto.matterId = matterReturnDto;
    }

    return monitorReturnDto;
  }
}
