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

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateCredentialsPipe())
  create(@Body() usersDto: UsersCreateDto): Promise<UsersEntity> {
    return this.usersService.create(usersDto);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(
    @Param('id') id: string,
    @Body() usersDto: Partial<UsersUpdateDto>,
  ): Promise<UsersEntity> {
    return this.usersService.update(id, usersDto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
