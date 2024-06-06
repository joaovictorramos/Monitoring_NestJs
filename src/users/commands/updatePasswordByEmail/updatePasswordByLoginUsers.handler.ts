/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordByLoginUsersCommand } from './updatePasswordByLoginUsers.command';
import { UsersEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { InvalidRoleException } from 'src/exceptions/entity.exceptions';
import { UsersService } from 'src/users/users.service';

@CommandHandler(UpdatePasswordByLoginUsersCommand)
export class UpdatePasswordByLoginUsersHandler
  implements
    ICommandHandler<
      Partial<UpdatePasswordByLoginUsersCommand>,
      UsersEntity | null
    >
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly usersService: UsersService,
  ) {}

  async execute(
    command: Partial<UpdatePasswordByLoginUsersCommand>,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { login: command.login },
    });
    if (!user) {
      throw new NotFoundException('No users found');
    }

    if (command.newPassword != command.confirmPassword) {
      throw new InvalidRoleException('The passwords are different');
    }
    user.password = await this.usersService.hashPassword(command.newPassword);
    return await this.usersRepository.save(user);
  }
}
