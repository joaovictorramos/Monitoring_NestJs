/* eslint-disable @typescript-eslint/no-unused-vars */
import { FindOneAbsenceQuery } from './../../../absence/queries/findOne/findOneAbsence.query';
import { FindOneAbsenceHandler } from './../../../absence/queries/findOne/findOneAbsence.handler';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMonitorCommand } from './deleteMonitor.command';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { forwardRef, Inject } from '@nestjs/common';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';

@CommandHandler(DeleteMonitorCommand)
export class DeleteMonitorHandler
  implements ICommandHandler<DeleteMonitorCommand | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}

  async execute(command: DeleteMonitorCommand): Promise<void> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: command.idPath },
      relations: ['absences'],
    });

    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    if (monitor.absences && monitor.absences.length > 0) {
      await this.absenceRepository.remove(monitor.absences);
    }

    await this.monitorRepository.remove(monitor);
  }
}
