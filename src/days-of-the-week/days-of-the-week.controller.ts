/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { DaysOfTheWeekCreateDto } from './dto/create-days-of-the-week.dto';
import { DaysOfTheWeekUpdateDto } from './dto/update-days-of-the-week.dto';
import { plainToClass } from 'class-transformer';
import { CreateDaysOfTheWeekCommand } from './commands/create/createDaysOfTheWeek.command';
import { FindAllDaysOfTheWeekQuery } from './queries/findAll/findAllDaysOfTheWeek.query';
import { FindOneDaysOfTheWeekQuery } from './queries/findOne/findOneDaysOfTheWeek.query';
import { DaysOfTheWeekEntity } from './entities/days-of-the-week.entity';
import { UpdateDaysOfTheWeekCommand } from './commands/update/updateDaysOfTheWeek.command';
import { DeleteDaysOfTheWeekCommand } from './commands/delete/deleteDaysOfTheWeek.command';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('days-of-the-week')
@UseGuards(RolesGuard)
export class DaysOfTheWeekController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  create(@Body() daysOfTheWeekDto: DaysOfTheWeekCreateDto) {
    const command = plainToClass(CreateDaysOfTheWeekCommand, daysOfTheWeekDto);
    return this.commandBus.execute(command);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllDaysOfTheWeekQuery, {});
    console.log(query);
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneDaysOfTheWeekQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(
    @Param('id') id: string,
    @Body() daysOfTheWeekDto: DaysOfTheWeekUpdateDto,
  ): Promise<DaysOfTheWeekEntity> {
    const command = plainToClass(UpdateDaysOfTheWeekCommand, daysOfTheWeekDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteDaysOfTheWeekCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
