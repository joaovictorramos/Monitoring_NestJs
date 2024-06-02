/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUsersQuery } from './findOneUsers.query';
import { UsersEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { Logger } from '@nestjs/common';

@QueryHandler(FindOneUsersQuery)
export class FindOneUsersHandler
  implements IQueryHandler<FindOneUsersQuery, UsersEntity | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(query: FindOneUsersQuery): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: query.id },
    });
    if (!user) {
      throw new NotFoundException('No users found');
    }
    return user;
  }
}
