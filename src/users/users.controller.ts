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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDto } from './dto/create-users.dto';
import { UsersEntity } from './entities/user.entity';
import { ValidateCredentialsPipe } from './pipes/users.pipes';
import { UsersUpdateDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidateCredentialsPipe())
  create(@Body() usersDto: UsersCreateDto): Promise<UsersEntity> {
    return this.usersService.create(usersDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() usersDto: Partial<UsersUpdateDto>,
  ): Promise<UsersEntity> {
    return this.usersService.update(id, usersDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}