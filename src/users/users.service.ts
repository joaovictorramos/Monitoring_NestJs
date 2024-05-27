/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersUpdateDto } from './dto/update-users.dto';
import { UsersCreateDto } from './dto/create-users.dto';
import { UsersEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InvalidRoleException,
  NotFoundException,
  AlreadyExistsException,
} from '../exceptions/entity.exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(usersDto: UsersCreateDto): Promise<UsersEntity> {
    const existingUser = await this.usersRepository.findOne({
      where: { login: usersDto.login, password: usersDto.password },
    });

    if (existingUser) {
      throw new AlreadyExistsException(
        'User with the same login and password already exists',
      );
    }

    if (!['PROFESSOR', 'ALUNO'].includes(usersDto.office)) {
      throw new InvalidRoleException(
        'Invalid role value. Allowed value: "PROFESSOR" or "ALUNO"',
      );
    }

    const user = new UsersEntity();
    const id = uuidv4();

    user.id = id;
    user.name = usersDto.name;
    user.login = usersDto.login;
    user.password = usersDto.password;
    user.office = usersDto.office;
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<UsersEntity[]> {
    const users = await this.usersRepository.find();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('No users found');
    }
    return user;
  }

  async findByLogin(login: string) {
    const user = await this.usersRepository.findOne({
      where: { login: login },
    });
    if (!user) {
      throw new NotFoundException('No users found');
    }
    return user;
  }

  async update(
    id: string,
    usersDto: Partial<UsersUpdateDto>,
  ): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('No users found');
    }

    if (!['PROFESSOR', 'ALUNO'].includes(usersDto.office)) {
      throw new InvalidRoleException(
        'Invalid role value. Allowed value: "PROFESSOR" or "ALUNO"',
      );
    }

    Object.assign(user, usersDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.delete(id);
    if (user.affected === 0) {
      throw new NotFoundException('No users found');
    }
  }
}
