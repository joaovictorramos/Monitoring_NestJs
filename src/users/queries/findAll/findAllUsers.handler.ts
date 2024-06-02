/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from './findAllUsers.query';
import { UsersEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler
  implements IQueryHandler<FindAllUsersQuery, Array<UsersEntity> | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(query: FindAllUsersQuery): Promise<Array<UsersEntity>> {
    const users = await this.usersRepository.find();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }
}
