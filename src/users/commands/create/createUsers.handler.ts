import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CreateUsersCommand } from './createUsers.command';
import {
  AlreadyExistsException,
  InvalidRoleException,
} from 'src/exceptions/entity.exceptions';

@CommandHandler(CreateUsersCommand)
export class CreateUsersHandler
  implements ICommandHandler<CreateUsersCommand, UsersEntity | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(command: CreateUsersCommand): Promise<UsersEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { login: command.login },
    });

    if (existingUser) {
      throw new AlreadyExistsException(
        'User with the same login already exists',
      );
    }

    if (!['PROFESSOR', 'ALUNO'].includes(command.office)) {
      throw new InvalidRoleException(
        'Invalid role value. Allowed value: "PROFESSOR" or "ALUNO"',
      );
    }

    const user = new UsersEntity();
    const id = uuidv4();

    user.id = id;
    user.name = command.name;
    user.login = command.login;
    user.password = await this.hashPassword(command.password);
    user.office = command.office;
    return await this.usersRepository.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
