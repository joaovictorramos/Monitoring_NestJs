/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';
import {
  InvalidClassroomRoleException,
  NoClassroomFoundException,
} from './exceptions/classroom.exceptions';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async create(classroomDto: CreateClassroomDto): Promise<ClassroomEntity> {
    if (!['SALA', 'LABORATÓRIO', 'AUDITÓRIO'].includes(classroomDto.type)) {
      throw new InvalidClassroomRoleException();
    }

    const classroom = new ClassroomEntity();
    const id = uuidv4();

    classroom.id = id;
    classroom.name = classroomDto.name;
    classroom.block = classroomDto.block;
    classroom.type = classroomDto.type;
    classroom.isReserved = classroomDto.isReserved;
    return await this.classroomRepository.save(classroom);
  }

  async findAll(): Promise<ClassroomEntity[]> {
    const classrooms = await this.classroomRepository.find();
    if (!classrooms.length) {
      throw new NoClassroomFoundException();
    }
    return classrooms;
  }

  async findOne(id: string) {
    const classroom = await this.classroomRepository.findOne({
      where: { id: id },
    });
    if (!classroom) {
      throw new NoClassroomFoundException();
    }
    return classroom;
  }

  async update(
    id: string,
    classroomDto: UpdateClassroomDto,
  ): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: id },
    });

    if (!classroom) {
      throw new NoClassroomFoundException();
    }

    if (!['SALA', 'LABORATÓRIO', 'AUDITÓRIO'].includes(classroomDto.type)) {
      throw new InvalidClassroomRoleException();
    }
    Object.assign(classroom, classroomDto);
    return await this.classroomRepository.save(classroom);
  }

  async remove(id: string): Promise<void> {
    const classroom = await this.classroomRepository.delete(id);
    if (classroom.affected === 0) {
      throw new NoClassroomFoundException();
    }
  }
}
