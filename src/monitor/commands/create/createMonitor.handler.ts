import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { CreateMonitorCommand } from './createMonitor.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyExistsException,
  InvalidRoleException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { UsersController } from 'src/users/users.controller';
import { ClassroomController } from 'src/classroom/classroom.controller';
import { MatterController } from 'src/matter/matter.controller';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';

@CommandHandler(CreateMonitorCommand)
export class CreateMonitorHandler
  implements ICommandHandler<CreateMonitorCommand, MonitorEntity | null>
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

  async execute(command: CreateMonitorCommand): Promise<MonitorEntity> {
    // Se já existe um monitor cadastrado
    const existingMonitor = await this.monitorRepository.findOne({
      where: {
        registration: command.registration,
        institutionalEmail: command.institutionalEmail,
      },
    });
    if (existingMonitor) {
      throw new AlreadyExistsException(
        'Monitor with the same registration or institutional email already exists',
      );
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

    // Se há dias da semana
    const existingDaysOfTheWeeks = await this.daysOfTheWeekRepository.findByIds(
      command.daysOfTheWeekIds,
    );
    if (!existingDaysOfTheWeeks) {
      throw new NotFoundException('No days of the week found');
    }

    // Validando o tipo de monitoria
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

    const monitor = new MonitorEntity();
    const id = uuidv4();

    monitor.id = id;
    monitor.registration = command.registration;
    monitor.name = command.name;
    monitor.actualPeriod = command.actualPeriod;
    monitor.institutionalEmail = command.institutionalEmail;
    monitor.typeOfMonitoring = command.typeOfMonitoring;
    monitor.startHour = command.startHour;
    monitor.endHour = command.endHour;
    monitor.usersId = existingUsers;
    monitor.classroomId = existingClassroom;
    monitor.matterId = existingMatters;
    monitor.daysOfTheWeekIds = existingDaysOfTheWeeks;
    return await this.monitorRepository.save(monitor);
  }
}
