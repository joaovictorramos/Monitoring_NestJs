import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateClassroomCommand } from './updateClassroom.command';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(UpdateClassroomCommand)
export class UpdateClassroomHandler
  implements
    ICommandHandler<Partial<UpdateClassroomCommand>, ClassroomEntity | null>
{
  constructor(
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async execute(
    command: Partial<UpdateClassroomCommand>,
  ): Promise<ClassroomEntity> {
    const classroom = await this.classroomRepository.findOne({
      where: { id: command.idPath },
    });

    if (!classroom) {
      throw new NotFoundException('No classroom found');
    }

    if (
      (!command.name && command.name !== undefined) ||
      (!command.type && command.type !== undefined) ||
      (command.isReserved == null && command.isReserved !== undefined)
    ) {
      throw new MissingCredentialsException(
        'Name, type and isReserved cannot be null',
      );
    }

    if (command.type !== undefined) {
      if (!['SALA', 'LABORATÓRIO', 'AUDITÓRIO'].includes(command.type)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "SALA", "LABORATÓRIO" or "AUDITÓRIO"',
        );
      }
    }
    Object.assign(classroom, command);
    return await this.classroomRepository.save(classroom);
  }
}
