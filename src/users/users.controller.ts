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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create user',
    description: 'Method responsible for creating users',
  })
  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateCredentialsPipe())
  create(@Body() usersDto: UsersCreateDto): Promise<UsersEntity> {
    const command = plainToClass(CreateUsersCommand, usersDto);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for users',
    description: 'Method responsible for searching for users',
  })
  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllUsersQuery, {});
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search user by id',
    description: 'Method responsible for searching user by id',
  })
  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneUsersQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user',
    description: 'Method responsible for updating users',
  })
  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(
    @Param('id') id: string,
    @Body() usersDto: Partial<UsersUpdateDto>,
  ): Promise<UsersEntity> {
    const command = plainToClass(UpdateUsersCommand, usersDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Method responsible for deleting users',
  })
  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteUsersCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
