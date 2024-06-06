/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindByLoginUsersQuery } from './findByLoginUsers.query';
import { UsersEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindByLoginUsersQuery)
export class FindByLoginUsersHandler
  implements IQueryHandler<FindByLoginUsersQuery, UsersEntity | null>
{
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async execute(query: FindByLoginUsersQuery): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: { login: query.login },
    });
    if (!user) {
      throw new NotFoundException('No users found');
    }
    return user;
  }
}
