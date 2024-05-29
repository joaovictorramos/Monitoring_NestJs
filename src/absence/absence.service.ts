/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsenceEntity } from './entities/absence.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { AbsenceReturnDto } from './dto/return-absence.dto';
import { MonitorService } from 'src/monitor/monitor.service';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
    private readonly monitorService: MonitorService,
  ) {}
  async create(absenceDto: CreateAbsenceDto) {
    const existingMonitor = await this.monitorService.findOne(
      absenceDto.monitorId,
    );
    if (!existingMonitor) {
      throw new NotFoundException('No monitor found');
    }
    if (!absenceDto.monitorId) {
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
    absence.date = absenceDto.date;
    absence.justification = absenceDto.justification;
    absence.monitorId = monitor;

    return await this.absenceRepository.save(absence);
  }

  async findAll(): Promise<AbsenceEntity[]> {
    const absence = await this.absenceRepository.find();
    if (!absence.length) {
      throw new NotFoundException('No absences found');
    }
    return absence;
  }

  async findOne(id: string) {
    const absence = await this.absenceRepository.findOne({
      where: { id: id },
      relations: ['monitorId'],
    });
    if (!absence) {
      throw new NotFoundException('No absence found');
    }

    const absenceReturnDto: AbsenceReturnDto = {
      id: absence.id,
      date: absence.date,
      justification: absence.justification,
    };

    if (absence.monitorId) {
      const monitor = await this.monitorService.findById(absence.monitorId.id);
      absenceReturnDto.monitors = monitor;
    }
    return absenceReturnDto;
  }

  async update(
    id: string,
    absenceDto: UpdateAbsenceDto,
  ): Promise<AbsenceEntity> {
    const absence = await this.absenceRepository.findOne({ where: { id: id } });
    if (!absence) {
      throw new NotFoundException('No absence found');
    }
    if (
      (!absenceDto.date && absenceDto.date !== undefined) ||
      (!absenceDto.monitorId && absenceDto.monitorId !== undefined)
    ) {
      throw new MissingCredentialsException('Date or monitor cannot be null');
    }

    Object.assign(absence, absenceDto);
    return await this.absenceRepository.save(absence);
  }

  async remove(id: string) {
    const absence = await this.absenceRepository.delete(id);
    if (absence.affected === 0) {
      throw new NotFoundException('No absence found');
    }
  }
}
