/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { FindOnlyTrueStatusClassroomQuery } from './findOnlyTrueStatusClassroom.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindOnlyTrueStatusClassroomQuery)
export class FindOnlyTrueStatusClassroomHandler
  implements
    IQueryHandler<
      FindOnlyTrueStatusClassroomQuery,
      Array<ClassroomEntity> | null
    >
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(
    query: FindOnlyTrueStatusClassroomQuery,
  ): Promise<Array<ClassroomEntity>> {
    const classrooms = await this.classroomRepository.find({
      where: { isReserved: true },
    });
    if (!classrooms.length) {
      throw new NotFoundException('No classroom found');
    }
    return classrooms;
  }
}
