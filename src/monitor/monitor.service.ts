/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  AlreadyExistsException,
} from '../exceptions/entity.exceptions';
import { UsersService } from 'src/users/users.service';
import { UsersReturnDto } from 'src/users/dto/return-users.dto';
import { MonitorReturnDto } from './dto/return-monitor.dto';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorEntity)
    private readonly monitorRepository: Repository<MonitorEntity>,
    private readonly usersService: UsersService,
  ) {}
  async create(monitorDto: CreateMonitorDto) {
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

    const existingUsers = await this.usersService.findOne(monitorDto.usersId);
    if (!existingUsers) {
      throw new AlreadyExistsException(
        'User with the same login and password already exists',
      );
    }

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
      relations: ['usersId'],
    });
    if (!monitor) {
      throw new NotFoundException('No monitors found');
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

    return monitorReturnDto;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitor`;
  }
}
