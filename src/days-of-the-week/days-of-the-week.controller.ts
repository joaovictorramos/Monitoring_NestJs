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
  UsePipes,
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
import { ValidateDaysOfTheWeekCredentialsPipe } from './pipes/daysOfTheWeek.pipes';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('days-of-the-week')
@Controller('days-of-the-week')
@UseGuards(RolesGuard)
export class DaysOfTheWeekController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create days of the week',
    description: 'Method responsible for creating days of the week',
  })
  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateDaysOfTheWeekCredentialsPipe())
  create(@Body() daysOfTheWeekDto: DaysOfTheWeekCreateDto) {
    const command = plainToClass(CreateDaysOfTheWeekCommand, daysOfTheWeekDto);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for days of the week',
    description: 'Method responsible for searching for days of the week',
  })
  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllDaysOfTheWeekQuery, {});
    console.log(query);
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search days of the week by id',
    description: 'Method responsible for searching days of the week by id',
  })
  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneDaysOfTheWeekQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update days of the week',
    description: 'Method responsible for updating days of the week',
  })
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete days of the week',
    description: 'Method responsible for deleting days of the week',
  })
  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteDaysOfTheWeekCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
