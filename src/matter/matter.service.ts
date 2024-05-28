/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMatterDto } from './dto/create-matter.dto';
import { UpdateMatterDto } from './dto/update-matter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatterEntity } from './entities/matter.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AlreadyExistsException,
  InvalidRoleException,
} from 'src/exceptions/entity.exceptions';

@Injectable()
export class MatterService {
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async create(matterDto: CreateMatterDto) {
    const existingMatter = await this.matterRepository.findOne({
      where: {
        name: matterDto.name,
      },
    });
    if (existingMatter) {
      throw new AlreadyExistsException(
        'Matter with the same name already exists',
      );
    }

    if (matterDto.type !== undefined) {
      const typeList = ['OBRIGATÓRIA', 'OPTATIVA'];
      if (!typeList.includes(matterDto.type)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "OBRIGATÓRIA" or "OPTATIVA"',
        );
      }
    }

    if (matterDto.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(matterDto.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA=FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }

    const matter = new MatterEntity();
    const id = uuidv4();

    matter.id = id;
    matter.name = matterDto.name;
    matter.teacher = matterDto.teacher;
    matter.type = matterDto.type;
    matter.period = matterDto.period;
    matter.startHour = matterDto.startHour;
    matter.endHour = matterDto.endHour;
    matter.daysOfTheWeek = matterDto.daysOfTheWeek;
    return await this.matterRepository.save(matter);
  }

  async findAll(): Promise<MatterEntity[]> {
    const matters = await this.matterRepository.find();
    if (!matters.length) {
      throw new NotFoundException('No mattera found');
    }
    return matters;
  }

  async findOne(id: string) {
    const matter = await this.matterRepository.findOne({ where: { id: id } });
    if (!matter) {
      throw new NotFoundException('No matter found');
    }
    return matter;
  }

  async update(id: string, matterDto: UpdateMatterDto): Promise<MatterEntity> {
    const matter = await this.matterRepository.findOne({ where: { id: id } });
    if (!matter) {
      throw new NotFoundException('No matter found');
    }

    if (
      (!matterDto.name && matterDto.name !== undefined) ||
      (!matterDto.teacher && matterDto.teacher !== undefined) ||
      (!matterDto.type && matterDto.type !== undefined) ||
      (!matterDto.startHour && matterDto.startHour !== undefined) ||
      (!matterDto.endHour && matterDto.endHour !== undefined) ||
      (!matterDto.daysOfTheWeek && matterDto.daysOfTheWeek !== undefined)
    ) {
      throw new InvalidRoleException(
        'Invalid role value. Name, teacher, type, startHour, endHour and daysOfTheWeek cannot be null',
      );
    }

    if (matterDto.type !== undefined) {
      const typeList = ['OBRIGATÓRIA', 'OPTATIVA'];
      if (!typeList.includes(matterDto.type)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "OBRIGATÓRIA" or "OPTATIVA"',
        );
      }
    }

    if (matterDto.daysOfTheWeek !== undefined) {
      const daysOfTheWeekList = [
        'DOMINGO',
        'SEGUNDA-FEIRA',
        'TERÇA-FEIRA',
        'QUARTA-FEIRA',
        'QUINTA-FEIRA',
        'SEXTA-FEIRA',
        'SÁBADO',
      ];
      if (!daysOfTheWeekList.includes(matterDto.daysOfTheWeek)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "DOMINGO", "SEGUNDA=FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
      }
    }
    Object.assign(matter, matterDto);
    return await this.matterRepository.save(matter);
  }

  async remove(id: string) {
    const matter = await this.matterRepository.delete(id);
    if (matter.affected === 0) {
      throw new NotFoundException('No matter found');
    }
  }
}
