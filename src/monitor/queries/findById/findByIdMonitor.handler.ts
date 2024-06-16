import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindByIdMonitorQuery } from './findByIdMonitor.query';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindByIdMonitorQuery)
export class FindByIdMonitorHandler
  implements IQueryHandler<FindByIdMonitorQuery, MonitorEntity | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
  ) {}

  async execute(query: FindByIdMonitorQuery): Promise<MonitorEntity> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: query.idPath },
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

    return monitor;
  }
}
