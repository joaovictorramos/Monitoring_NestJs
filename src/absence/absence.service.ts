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
  NotFoundException,
} from 'src/exceptions/entity.exceptions';
import { AbsenceReturnDto } from './dto/return-absence.dto';

@Injectable()
export class AbsenceService {
  constructor(
    @InjectRepository(AbsenceEntity)
    private readonly absenceRepository: Repository<AbsenceEntity>,
  ) {}
  async create(absenceDto: CreateAbsenceDto) {
    const absence = new AbsenceEntity();
    const id = uuidv4();

    absence.id = id;
    absence.date = absenceDto.date;
    absence.justification = absenceDto.justification;
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
    });
    if (!absence) {
      throw new NotFoundException('No absence found');
    }

    const absenceReturnDto: AbsenceReturnDto = {
      id: absence.id,
      date: absence.date,
      justification: absence.justification,
    };
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
    if (absenceDto.date !== undefined) {
      if (!absenceDto.date) {
        throw new InvalidRoleException(
          'Invalid role value. Date cannot be null',
        );
      }
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
