import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassroomEntity } from '../entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClassroomSeed implements OnModuleInit {
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const classroomTable = await this.classroomRepository.count();
    if (classroomTable === 0) {
      const classrooms = [
        { name: 'A310', block: 'A', type: 'SALA' },
        { name: 'A312', block: 'A', type: 'SALA' },
        { name: 'A313', block: 'A', type: 'SALA' },
        { name: 'A314', block: 'A', type: 'SALA' },
        { name: 'A315', block: 'A', type: 'SALA' },
        { name: 'A316', block: 'A', type: 'SALA' },
        { name: 'A317', block: 'A', type: 'LABORATÓRIO' },
        { name: 'J201', block: 'J', type: 'SALA' },
        { name: 'J202', block: 'J', type: 'SALA' },
        { name: 'J203', block: 'J', type: 'SALA' },
        { name: 'J204', block: 'J', type: 'LABORATÓRIO' },
        { name: 'J205', block: 'J', type: 'LABORATÓRIO' },
        { name: 'G101', block: 'G', type: 'SALA' },
        { name: 'AUDITÓRIO 1', block: null, type: 'AUDITÓRIO' },
        { name: 'AUDITÓRIO 2', block: null, type: 'AUDITÓRIO' },
      ];

      const classroomEntities = classrooms.map((data) => {
        const classroom = new ClassroomEntity();
        classroom.name = data.name;
        classroom.block = data.block;
        classroom.type = data.type;
        return classroom;
      });

      await this.classroomRepository.save(classroomEntities);
    }
  }
}
