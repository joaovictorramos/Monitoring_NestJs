/* eslint-disable @typescript-eslint/no-unused-vars */
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { UpdateMonitorCommand } from './updateMonitor.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { UsersController } from 'src/users/users.controller';
import { ClassroomController } from 'src/classroom/classroom.controller';
import { MatterController } from 'src/matter/matter.controller';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';

@CommandHandler(UpdateMonitorCommand)
export class UpdateMonitorHandler
  implements
    ICommandHandler<Partial<UpdateMonitorCommand>, MonitorEntity | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
    private readonly usersController: UsersController,
    private readonly classroomController: ClassroomController,
    private readonly matterController: MatterController,
  ) {}

  async execute(
    command: Partial<UpdateMonitorCommand>,
  ): Promise<MonitorEntity> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: command.idPath },
      relations: ['usersId', 'classroomId', 'matterId', 'daysOfTheWeekIds'],
    });

    if (!monitor) {
      throw new NotFoundException('Monitor not found');
    }

    if (command.registration !== undefined) {
      monitor.registration = command.registration;
    }
    if (command.name !== undefined) {
      monitor.name = command.name;
    }
    if (command.actualPeriod !== undefined) {
      monitor.actualPeriod = parseInt(command.actualPeriod);
    }
    if (command.institutionalEmail !== undefined) {
      monitor.institutionalEmail = command.institutionalEmail;
    }
    if (command.typeOfMonitoring !== undefined) {
      const typeOfMonitoringList = [
        'PRESENCIAL',
        'REMOTO',
        'PRESENCIAL E REMOTO',
      ];
      if (!typeOfMonitoringList.includes(command.typeOfMonitoring)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed values: "PRESENCIAL", "REMOTO" or "PRESENCIAL E REMOTO"',
        );
      }
      monitor.typeOfMonitoring = command.typeOfMonitoring;
    }
    if (command.startHour !== undefined) {
      monitor.startHour = command.startHour;
    }
    if (command.endHour !== undefined) {
      monitor.endHour = command.endHour;
    }
    if (command.usersId !== undefined) {
      const existingUsers = await this.usersController.findOne(command.usersId);
      if (!existingUsers) {
        throw new NotFoundException('No users found');
      }
      monitor.usersId = existingUsers;
    }
    if (command.classroomId !== undefined) {
      const existingClassroom = await this.classroomController.findOne(
        command.classroomId,
      );
      monitor.classroomId = existingClassroom;
    }
    if (command.matterId !== undefined) {
      const existingMatters = await this.matterController.findOne(
        command.matterId,
      );
      monitor.matterId = existingMatters;
    }

    if (command.daysOfTheWeekIds !== undefined) {
      const daysOfTheWeekIds = await this.daysOfTheWeekRepository.findByIds(
        command.daysOfTheWeekIds,
      );
      if (daysOfTheWeekIds.length !== command.daysOfTheWeekIds.length) {
        throw new NotFoundException('Some days of the week not found');
      }
      monitor.daysOfTheWeekIds = daysOfTheWeekIds;
    }

    if (
      (!command.registration && command.registration !== undefined) ||
      (!command.name && command.name !== undefined) ||
      (!command.actualPeriod && command.actualPeriod !== undefined) ||
      (!command.institutionalEmail &&
        command.institutionalEmail !== undefined) ||
      (!command.typeOfMonitoring && command.typeOfMonitoring !== undefined) ||
      (!command.daysOfTheWeekIds && command.daysOfTheWeekIds !== undefined) ||
      (!command.startHour && command.startHour !== undefined) ||
      (!command.endHour && command.endHour !== undefined) ||
      (!command.usersId && command.usersId !== undefined) ||
      (!command.matterId && command.matterId !== undefined)
    ) {
      throw new MissingCredentialsException(
        'Registration, name, institutionalEmail, typeOfMonitoring, daysOfTheWeek, startHour, endHour, usersId or matterId cannot be null',
      );
    }

    return await this.monitorRepository.save(monitor);
  }
}
