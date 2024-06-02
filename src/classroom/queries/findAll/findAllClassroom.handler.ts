/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllClassroomQuery } from './findAllClassroom.query';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindAllClassroomQuery)
export class FindAllClassroomHandler
  implements
    IQueryHandler<FindAllClassroomQuery, Array<ClassroomEntity> | null>
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(query: FindAllClassroomQuery): Promise<Array<ClassroomEntity>> {
    const classrooms = await this.classroomRepository.find();
    if (!classrooms.length) {
      throw new NotFoundException('No classroom found');
    }
    return classrooms;
  }
}
