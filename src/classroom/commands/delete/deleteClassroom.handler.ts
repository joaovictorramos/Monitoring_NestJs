import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteClassroomCommand } from './DeleteClassroom.command';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@CommandHandler(DeleteClassroomCommand)
export class DeleteClassroomHandler
  implements ICommandHandler<DeleteClassroomCommand | null>
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(command: DeleteClassroomCommand): Promise<void> {
    const classroom = await this.classroomRepository.delete(command.idPath);
    if (classroom.affected === 0) {
      throw new NotFoundException('No classroom found');
    }
  }
}
