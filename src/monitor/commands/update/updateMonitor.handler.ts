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

@CommandHandler(UpdateMonitorCommand)
export class UpdateMonitorHandler
  implements
    ICommandHandler<Partial<UpdateMonitorCommand>, MonitorEntity | null>
{
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    private readonly usersController: UsersController,
    private readonly classroomController: ClassroomController,
    private readonly matterController: MatterController,
  ) {}

  async execute(
    command: Partial<UpdateMonitorCommand>,
  ): Promise<MonitorEntity> {
    const monitor = await this.monitorRepository.findOne({
      where: { id: command.idPath },
    });
    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    // Se há usuário
    const existingUsers = await this.usersController.findOne(command.usersId);
    if (!existingUsers) {
      throw new NotFoundException('No users found');
    }

    // Se há matéria
    const existingMatters = await this.matterController.findOne(
      command.matterId,
    );
    if (!existingMatters) {
      throw new NotFoundException('No matter found');
    }

    // Se há sala de aula
    let existingClassroom = await this.classroomController.findOne(
      command.classroomId,
    );
    if (command.classroomId === undefined) {
      existingClassroom = null;
    }

    if (command.typeOfMonitoring !== undefined) {
      const typeOfMonitoringList = [
        'PRESENCIAL',
        'REMOTO',
        'PRESENCIAL E REMOTO',
      ];
      if (!typeOfMonitoringList.includes(command.typeOfMonitoring)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "PRESENCIAL", "REMOTO" or "PRESENCIAL E REMOTO"',
        );
      }
    }

    if (command.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(command.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }

    if (
      (!command.registration && command.registration !== undefined) ||
      (!command.name && command.name !== undefined) ||
      (!command.institutionalEmail &&
        command.institutionalEmail !== undefined) ||
      (!command.typeOfMonitoring && command.typeOfMonitoring !== undefined) ||
      (!command.daysOfTheWeek && command.daysOfTheWeek !== undefined) ||
      (!command.startHour && command.startHour !== undefined) ||
      (!command.endHour && command.endHour !== undefined) ||
      (!command.usersId && command.usersId !== undefined) ||
      (!command.matterId && command.matterId !== undefined)
    ) {
      throw new MissingCredentialsException(
        'Registration, name, institutionalEmail, typeOfMonitoring, daysOfTheWeek, startHour, endHour, usersId or matterId cannot be null',
      );
    }

    Object.assign(monitor, command);
    return await this.monitorRepository.save(monitor);
  }
}
