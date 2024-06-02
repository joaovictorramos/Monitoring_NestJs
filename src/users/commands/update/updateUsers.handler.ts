import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUsersCommand } from './updateUsers.command';
import { UsersEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InvalidRoleException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(UpdateUsersCommand)
export class UpdateUsersHandler
  implements ICommandHandler<Partial<UpdateUsersCommand>, UsersEntity | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(command: Partial<UpdateUsersCommand>): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: command.idPath },
    });
    if (!user) {
      throw new NotFoundException('No users found');
    }

    if (command.office !== undefined) {
      if (!['PROFESSOR', 'ALUNO'].includes(command.office)) {
        throw new InvalidRoleException(
          'Invalid role value. Allowed value: "PROFESSOR" or "ALUNO"',
        );
      }
    }

    Object.assign(user, command);
    return await this.usersRepository.save(user);
  }
}
