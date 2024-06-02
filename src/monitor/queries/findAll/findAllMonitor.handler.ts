/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMonitorQuery } from './findAllMonitor.query';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindAllMonitorQuery)
export class FindAllMonitorHandler
  implements IQueryHandler<FindAllMonitorQuery, Array<MonitorEntity> | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
  ) {}

  async execute(query: FindAllMonitorQuery): Promise<Array<MonitorEntity>> {
    const monitors = await this.monitorRepository.find();
    if (!monitors.length) {
      throw new NotFoundException('No monitors found');
    }
    return monitors;
  }
}
