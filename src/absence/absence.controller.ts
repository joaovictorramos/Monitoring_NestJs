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
  Logger,
} from '@nestjs/common';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { ValidateAbsenceCredentialsPipe } from './pipes/absence.pipes';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FindAllAbsenceQuery } from './queries/findAll/findAllAbsence.query';
import { FindOneAbsenceQuery } from './queries/findOne/findOneAbsence.query';
import { CreateAbsenceCommand } from './commands/create/createAbsence.command';
import { UpdateAbsenceCommand } from './commands/update/updateAbsence.command';
import { DeleteAbsenceCommand } from './commands/delete/deleteAbsence.command';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindByMonitorAbsenceQuery } from './queries/findByMonitor/findByMonitorAbsence.query';
import { CreateAbsenceAlternativeDto } from './dto/create-absence-alternative.dto';
import { CreateAbsenceAlternativeCommand } from './commands/createAbsenceAlternative/createAbsenceAlternative.command';

@ApiTags('absence')
@Controller('absence')
@UseGuards(RolesGuard)
export class AbsenceController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create absence',
    description: 'Method responsible for creating absences',
  })
  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateAbsenceCredentialsPipe())
  create(@Body() absenceDto: CreateAbsenceDto) {
    const command = plainToClass(CreateAbsenceCommand, absenceDto);
    return this.commandBus.execute(command);
  }

  @ApiExcludeEndpoint()
  @Post('createToMonitor')
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateAbsenceCredentialsPipe())
  createAbsence(@Body() absenceDto: CreateAbsenceAlternativeDto) {
    const command = plainToClass(CreateAbsenceAlternativeCommand, absenceDto);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for absences',
    description: 'Method responsible for searching for absences',
  })
  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllAbsenceQuery, {});
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search absences by id',
    description: 'Method responsible for searching absences by id',
  })
  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneAbsenceQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiExcludeEndpoint()
  @Get('/monitor/:monitorId')
  @Roles(Role.PROFESSOR)
  findByMonitor(@Param('monitorId') id: string) {
    const query = plainToClass(FindByMonitorAbsenceQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update absence',
    description: 'Method responsible for updating absences',
  })
  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() absenceDto: UpdateAbsenceDto) {
    const command = plainToClass(UpdateAbsenceCommand, absenceDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete absence',
    description: 'Method responsible for deleting absences',
  })
  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteAbsenceCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
