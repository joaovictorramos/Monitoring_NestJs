/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/create-users.dto';
import { UsersEntity } from './entities/user.entity';
import { ValidateCredentialsPipe } from './pipes/users.pipes';
import { UsersUpdateDto } from './dto/update-users.dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/auth/auth.roles';
import { Role } from 'src/enums/role.enum';
import { plainToClass } from 'class-transformer';
import { FindAllUsersQuery } from './queries/findAll/findAllUsers.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindOneUsersQuery } from './queries/findOne/findOneUsers.query';
import { CreateUsersCommand } from './commands/create/createUsers.command';
import { UpdateUsersCommand } from './commands/update/updateUsers.command';
import { DeleteUsersCommand } from './commands/delete/deleteUsers.command';
import { UsersUpdatePasswordByLoginDto } from './dto/update-password';
import { UpdatePasswordByLoginUsersCommand } from './commands/updatePasswordByEmail/updatePasswordByLoginUsers.command';
import { FindByLoginUsersQuery } from './queries/findByLogin/findByLoginUsers.query';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('create')
  @UsePipes(new ValidateCredentialsPipe())
  create(@Body() usersDto: UsersCreateDto): Promise<UsersEntity> {
    const command = plainToClass(CreateUsersCommand, usersDto);
    return this.commandBus.execute(command);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  @UseGuards(RolesGuard)
  findAll() {
    const query = plainToClass(FindAllUsersQuery, {});
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneUsersQuery, { id: id });
    return this.queryBus.execute(query);
  }

  // Apenas para autenticação
  @Get('/login/:login')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findByLogin(@Param('login') login: string) {
    const query = plainToClass(FindByLoginUsersQuery, { login: login });
    return this.queryBus.execute(query);
  }

  @Patch('recoverPassword')
  updatePasswordByLogin(
    @Body() usersDto: Partial<UsersUpdatePasswordByLoginDto>,
  ): Promise<UsersEntity> {
    const command = plainToClass(UpdatePasswordByLoginUsersCommand, usersDto);
    return this.commandBus.execute(command);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() usersDto: Partial<UsersUpdateDto>,
  ): Promise<UsersEntity> {
    const command = plainToClass(UpdateUsersCommand, usersDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteUsersCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
