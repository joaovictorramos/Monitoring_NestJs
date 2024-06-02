import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAbsenceCommand } from './createAbsence.command';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { UsersEntity } from 'src/users/entities/user.entity';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { MonitorController } from 'src/monitor/monitor.controller';

@CommandHandler(CreateAbsenceCommand)
export class CreateAbsenceHandler
  implements ICommandHandler<CreateAbsenceCommand, AbsenceEntity>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
    private readonly monitorController: MonitorController,
  ) {}

  async execute(command: CreateAbsenceCommand): Promise<AbsenceEntity> {
    const existingMonitor = await this.monitorController.findOne(
      command.monitorId,
    );
    if (!existingMonitor) {
      throw new NotFoundException('No monitor found');
    }
    if (!command.monitorId) {
      throw new NotFoundException('No monitor found');
    }

    const users = new UsersEntity();
    users.id = existingMonitor.users.id;
    users.name = existingMonitor.users.name;
    users.login = existingMonitor.users.login;
    users.password = existingMonitor.users.password;
    users.office = existingMonitor.users.office;

    const matter = new MatterEntity();
    matter.id = existingMonitor.matters.id;
    matter.name = existingMonitor.matters.name;
    matter.teacher = existingMonitor.matters.teacher;
    matter.type = existingMonitor.matters.type;
    matter.period = existingMonitor.matters.period;
    matter.startHour = existingMonitor.matters.startHour;
    matter.endHour = existingMonitor.matters.endHour;
    matter.daysOfTheWeek = existingMonitor.matters.daysOfTheWeek;

    const classroom = new ClassroomEntity();
    classroom.id = existingMonitor.classrooms.id;
    classroom.name = existingMonitor.classrooms.name;
    classroom.block = existingMonitor.classrooms.block;
    classroom.type = existingMonitor.classrooms.type;
    classroom.isReserved = existingMonitor.classrooms.isReserved;

    const monitor = new MonitorEntity();
    monitor.id = existingMonitor.id;
    monitor.registration = existingMonitor.registration;
    monitor.name = existingMonitor.name;
    monitor.actualPeriod = existingMonitor.actualPeriod;
    monitor.institutionalEmail = existingMonitor.institutionalEmail;
    monitor.typeOfMonitoring = existingMonitor.typeOfMonitoring;
    monitor.daysOfTheWeek = existingMonitor.daysOfTheWeek;
    monitor.startHour = existingMonitor.startHour;
    monitor.endHour = existingMonitor.endHour;
    monitor.usersId = users;
    monitor.classroomId = classroom;
    monitor.matterId = matter;

    const absence = new AbsenceEntity();
    const id = uuidv4();

    absence.id = id;
    absence.date = command.date;
    absence.justification = command.justification;
    absence.monitorId = monitor;

    return await this.absenceRepository.save(absence);
  }
}
