/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/guard-auth.dto';
import {
  MissingCredentialsException,
  UnauthorizedUserException,
} from 'src/exceptions/entity.exceptions';
import { CachesService } from 'src/caches/caches.service';
import { FindByLoginUsersHandler } from 'src/users/queries/findByLogin/findByLoginUsers.handler';

@Injectable()
export class AuthService {
  constructor(
    private findByLoginHandler: FindByLoginUsersHandler,
    private jwtService: JwtService,
    private redisCache: CachesService,
  ) {}

  async signIn(authDto: AuthDto): Promise<any> {
    if (authDto.login !== undefined && authDto.password !== undefined) {
      const usersDto = {
        login: authDto.login,
      };

      const users = await this.findByLoginHandler.execute(usersDto);
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
      await this.redisCache.storeData(token.access_token);
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
