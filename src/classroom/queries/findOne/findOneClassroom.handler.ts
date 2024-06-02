import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneClassroomQuery } from './findOneClassroom.query';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindOneClassroomQuery)
export class FindOneClassroomHandler
  implements IQueryHandler<FindOneClassroomQuery, ClassroomEntity | null>
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(query: FindOneClassroomQuery): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: query.id },
    });
    if (!classroom) {
      throw new NotFoundException('No classroom found');
    }
    return classroom;
  }
}
