/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { v4 as uuidv4 } from 'uuid';
import { Not, Repository } from 'typeorm';
import {
  InvalidRoleException,
  AlreadyExistsException,
} from '../exceptions/entity.exceptions';
import { UsersService } from 'src/users/users.service';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';
import { MonitorReturnDto } from './dto/return-monitor.dto';
import { ClassroomService } from './../classroom/classroom.service';
import { MatterReturnDto } from './../matter/dto/return-matter.dto';
import { MatterService } from './../matter/matter.service';
import { ClassroomReturnDto } from './../classroom/dto/return-classroom.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    private readonly classroomService: ClassroomService,
    private readonly usersService: UsersService,
    private readonly matterService: MatterService,
  ) {}
  async create(monitorDto: CreateMonitorDto) {
    // Se já existe um monitor cadastrado
    const existingMonitor = await this.monitorRepository.findOne({
      where: {
        registration: monitorDto.registration,
        institutionalEmail: monitorDto.institutionalEmail,
      },
    });
    if (existingMonitor) {
      throw new AlreadyExistsException(
        'Monitor with the same registration or institutional email already exists',
      );
    }

    // Se há usuário
    const existingUsers = await this.usersService.findOne(monitorDto.usersId);
    if (!existingUsers) {
      throw new NotFoundException('No users found');
    }

    // Se há matéria
    const existingMatters = await this.matterService.findOne(
      monitorDto.matterId,
    );
    if (!existingMatters) {
      throw new NotFoundException('No matter found');
    }

    // Se há sala de aula
    let existingClassroom = await this.classroomService.findOne(
      monitorDto.classroomId,
    );
    if (monitorDto.classroomId === undefined) {
      existingClassroom = null;
    }

    // Validando o tipo de monitoria
    if (monitorDto.typeOfMonitoring !== undefined) {
      const typeOfMonitoringList = [
        'PRESENCIAL',
        'REMOTO',
        'PRESENCIAL E REMOTO',
      ];
      if (!typeOfMonitoringList.includes(monitorDto.typeOfMonitoring)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "PRESENCIAL", "REMOTO" or "PRESENCIAL E REMOTO"',
        );
      }
    }

    // Validando o dia da semana
    if (monitorDto.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(monitorDto.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA=FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }

    const monitor = new MonitorEntity();
    const id = uuidv4();

    monitor.id = id;
    monitor.registration = monitorDto.registration;
    monitor.name = monitorDto.name;
    monitor.actualPeriod = monitorDto.actualPeriod;
    monitor.institutionalEmail = monitorDto.institutionalEmail;
    monitor.typeOfMonitoring = monitorDto.typeOfMonitoring;
    monitor.daysOfTheWeek = monitorDto.daysOfTheWeek;
    monitor.startHour = monitorDto.startHour;
    monitor.endHour = monitorDto.endHour;
    monitor.usersId = existingUsers;
    monitor.classroomId = existingClassroom;
    monitor.matterId = existingMatters;
    return await this.monitorRepository.save(monitor);
  }

  async findAll(): Promise<MonitorEntity[]> {
    const monitors = await this.monitorRepository.find();
    if (!monitors.length) {
      throw new NotFoundException('No monitors found');
    }
    return monitors;
  }

  async findOne(id: string) {
    const monitor = await this.monitorRepository.findOne({
      where: { id: id },
      relations: ['usersId', 'classroomId', 'matterId'],
    });
    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    const monitorReturnDto: MonitorReturnDto = {
      id: monitor.id,
      registration: monitor.registration,
      name: monitor.name,
      actualPeriod: monitor.actualPeriod,
      institutionalEmail: monitor.institutionalEmail,
      typeOfMonitoring: monitor.typeOfMonitoring,
      daysOfTheWeek: monitor.daysOfTheWeek,
      startHour: monitor.startHour,
      endHour: monitor.endHour,
    };

    if (monitor.usersId) {
      const usersReturnDto: UsersReturnDto = {
        id: monitor.usersId.id,
        name: monitor.usersId.name,
        login: monitor.usersId.login,
        password: monitor.usersId.password,
        office: monitor.usersId.office,
      };
      monitorReturnDto.users = usersReturnDto;
    }
    if (monitor.classroomId) {
      const classroomReturnDto: ClassroomReturnDto = {
        id: monitor.classroomId.id,
        name: monitor.classroomId.name,
        block: monitor.classroomId.block,
        type: monitor.classroomId.type,
        isReserved: monitor.classroomId.isReserved,
      };
      monitorReturnDto.classrooms = classroomReturnDto;
    }
    if (monitor.matterId) {
      const matterReturnDto: MatterReturnDto = {
        id: monitor.matterId.id,
        name: monitor.matterId.name,
        teacher: monitor.matterId.teacher,
        type: monitor.matterId.type,
        period: monitor.matterId.period,
        startHour: monitor.matterId.startHour,
        endHour: monitor.matterId.endHour,
        daysOfTheWeek: monitor.matterId.daysOfTheWeek,
      };
      monitorReturnDto.matters = matterReturnDto;
    }

    return monitorReturnDto;
  }

  async findById(id: string) {
    const monitor = await this.monitorRepository.findOne({
      where: { id: id },
      relations: ['usersId', 'classroomId', 'matterId'],
    });
    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    return monitor;
  }

  async update(
    id: string,
    monitorDto: UpdateMonitorDto,
  ): Promise<MonitorEntity> {
    const monitor = await this.monitorRepository.findOne({ where: { id: id } });
    if (!monitor) {
      throw new NotFoundException('No monitor found');
    }

    // Se há usuário
    const existingUsers = await this.usersService.findOne(monitorDto.usersId);
    if (!existingUsers) {
      throw new NotFoundException('No users found');
    }

    // Se há matéria
    const existingMatters = await this.matterService.findOne(
      monitorDto.matterId,
    );
    if (!existingMatters) {
      throw new NotFoundException('No matter found');
    }

    // Se há sala de aula
    let existingClassroom = await this.classroomService.findOne(
      monitorDto.classroomId,
    );
    if (monitorDto.classroomId === undefined) {
      existingClassroom = null;
    }

    if (monitorDto.typeOfMonitoring !== undefined) {
      const typeOfMonitoringList = [
        'PRESENCIAL',
        'REMOTO',
        'PRESENCIAL E REMOTO',
      ];
      if (!typeOfMonitoringList.includes(monitorDto.typeOfMonitoring)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "PRESENCIAL", "REMOTO" or "PRESENCIAL E REMOTO"',
        );
      }
    }

    if (monitorDto.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(monitorDto.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }

    Object.assign(monitor, monitorDto);
    return await this.monitorRepository.save(monitor);
  }

  async remove(id: string) {
    const monitor = await this.monitorRepository.delete(id);
    if (monitor.affected === 0) {
      throw new NotFoundException('No monitor found');
    }
  }
}
