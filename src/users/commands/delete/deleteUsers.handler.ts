import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteUsersCommand } from './deleteUsers.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/users/entities/user.entity';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

export class DeleteUsersHandler
  implements ICommandHandler<DeleteUsersCommand | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(command: DeleteUsersCommand): Promise<void> {
    const user = await this.usersRepository.delete(command.idPath);
    if (user.affected === 0) {
      throw new NotFoundException('No users found');
    }
  }
}
