import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMonitorCommand } from './deleteMonitor.command';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@CommandHandler(DeleteMonitorCommand)
export class DeleteMonitorHandler
  implements ICommandHandler<DeleteMonitorCommand | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
  ) {}

  async execute(command: DeleteMonitorCommand): Promise<void> {
    const monitor = await this.monitorRepository.delete(command.idPath);
    if (monitor.affected === 0) {
      throw new NotFoundException('No monitor found');
    }
  }
}
