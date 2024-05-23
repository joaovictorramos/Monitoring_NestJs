/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import {
  InvalidMonitorRoleException,
  MonitorAlreadyExistsException,
} from './exceptions/monitor.exceptions';
import { UsersService } from 'src/users/users.service';
import { UserAlreadyExistsException } from 'src/users/exceptions/users.exceptions';

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
      throw new MonitorAlreadyExistsException();
    }

    const existingUsers = await this.usersService.findOne(monitorDto.usersId);
    if (!existingUsers) {
      throw new UserAlreadyExistsException();
    }

    const typeOfMonitoringList = [
      'PRESENCIAL',
      'REMOTO',
      'PRESENCIAL E REMOTO',
    ];
    if (!typeOfMonitoringList.includes(monitorDto.typeOfMonitoring)) {
      throw new InvalidMonitorRoleException(
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
      throw new InvalidMonitorRoleException(
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

  findAll() {
    return `This action returns all monitor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitor`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a #${id} monitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitor`;
  }
}
