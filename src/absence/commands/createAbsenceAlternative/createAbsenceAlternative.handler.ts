/* eslint-disable prettier/prettier */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { InvalidRoleException, NotFoundException } from 'src/exceptions/entity.exceptions';
import { UsersEntity } from 'src/users/entities/user.entity';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { MonitorController } from 'src/monitor/monitor.controller';
import { CreateAbsenceAlternativeCommand } from './createAbsenceAlternative.command';
import { FindAllAbsenceHandler } from 'src/absence/queries/findAll/findAllAbsence.handler';

@CommandHandler(CreateAbsenceAlternativeCommand)
export class CreateAbsenceAlternativeHandler
  implements ICommandHandler<CreateAbsenceAlternativeCommand, AbsenceEntity>
{
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
    private readonly monitorController: MonitorController,
    private readonly findAllAbsenceHandler: FindAllAbsenceHandler,
  ) {}

  async execute(
    command: CreateAbsenceAlternativeCommand,
  ): Promise<AbsenceEntity> {
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
    users.id = existingMonitor.usersId.id;
    users.name = existingMonitor.usersId.name;
    users.login = existingMonitor.usersId.login;
    users.password = existingMonitor.usersId.password;
    users.office = existingMonitor.usersId.office;

    const matter = new MatterEntity();
    matter.id = existingMonitor.matterId.id;
    matter.name = existingMonitor.matterId.name;
    matter.teacher = existingMonitor.matterId.teacher;
    matter.type = existingMonitor.matterId.type;
    matter.period = existingMonitor.matterId.period;
    matter.startHour = existingMonitor.matterId.startHour;
    matter.endHour = existingMonitor.matterId.endHour;
    matter.daysOfTheWeekId = existingMonitor.matterId.daysOfTheWeekId;

    const classroom = new ClassroomEntity();
    classroom.id = existingMonitor.classroomId.id;
    classroom.name = existingMonitor.classroomId.name;
    classroom.block = existingMonitor.classroomId.block;
    classroom.type = existingMonitor.classroomId.type;

    const monitor = new MonitorEntity();
    monitor.id = existingMonitor.id;
    monitor.registration = existingMonitor.registration;
    monitor.name = existingMonitor.name;
    monitor.actualPeriod = existingMonitor.actualPeriod;
    monitor.institutionalEmail = existingMonitor.institutionalEmail;
    monitor.typeOfMonitoring = existingMonitor.typeOfMonitoring;
    monitor.startHour = existingMonitor.startHour;
    monitor.endHour = existingMonitor.endHour;
    monitor.usersId = users;
    monitor.classroomId = classroom;
    monitor.matterId = matter;
    monitor.daysOfTheWeekIds = existingMonitor.daysOfTheWeekIds;

    const absence = new AbsenceEntity();
    const id = uuidv4();

    absence.id = id;
    absence.date = command.date;
    absence.justification = command.justification;
    absence.monitorId = monitor;

    let absences = [];
    let isRepeteDate = false, isAbsence = true;
    try{
      absences = await this.findAllAbsenceHandler.execute(null);
    } catch (err){
      isAbsence = false
    }

    if (absences.length && isAbsence) {
      (await absences).map((a) => { 
        if (a.monitorId.id == monitor.id && a.date == absence.date) {
          isRepeteDate = true;
        }
      });
      if (isRepeteDate) {
        throw new InvalidRoleException('Monitor is already missing with this date!');
      }
    }

    return await this.absenceRepository.save(absence);
  }
}
