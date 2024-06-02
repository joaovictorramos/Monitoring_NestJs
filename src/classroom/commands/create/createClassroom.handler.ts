import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateClassroomCommand } from './createClassroom.command';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AlreadyExistsException,
  InvalidRoleException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(CreateClassroomCommand)
export class CreateClassroomHandler
  implements ICommandHandler<CreateClassroomCommand, ClassroomEntity | null>
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(command: CreateClassroomCommand): Promise<ClassroomEntity> {
    const existingClassroom = await this.classroomRepository.findOne({
      where: { name: command.name },
    });
    if (existingClassroom) {
      throw new AlreadyExistsException(
        'Classroom with the same name already exists',
      );
    }

    if (!['SALA', 'LABORATÓRIO', 'AUDITÓRIO'].includes(command.type)) {
      throw new InvalidRoleException(
        'Invalid role value. Allowed value: "SALA", "LABORATÓRIO" or "AUDITÓRIO"',
      );
    }

    const classroom = new ClassroomEntity();
    const id = uuidv4();

    classroom.id = id;
    classroom.name = command.name;
    classroom.block = command.block;
    classroom.type = command.type;
    classroom.isReserved = command.isReserved;
    return await this.classroomRepository.save(classroom);
  }
}
