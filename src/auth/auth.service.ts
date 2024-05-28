/* eslint-disable @typescript-eslint/no-unused-vars */
import { UsersService } from './../users/users.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/guard-auth.dto';
import {
  MissingCredentialsException,
  UnauthorizedUserException,
} from 'src/exceptions/entity.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authDto: AuthDto): Promise<any> {
    if (authDto.login !== undefined && authDto.password !== undefined) {
      const users = await this.usersService.findByLogin(authDto.login);
      if (!users) {
        throw new UnauthorizedUserException('Unauthorized user');
      }

      const isPassword = await this.checkPassword(
        authDto.password,
        users.password,
      );
      if (!isPassword) {
        throw new UnauthorizedUserException('Unauthorized user');
      }

      const payload = {
        login: users.login,
        name: users.name,
        office: users.office,
      };
      const token = {
        access_token: await this.jwtService.signAsync(payload),
      };
      return token;
    }
    throw new MissingCredentialsException('Login and password are required');
  }

  private async checkPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
