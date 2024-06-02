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
import { MonitorService } from './monitor.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';
import { ValidateMonitorCredentialsPipe } from './pipes/monitor.pipes';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FindAllMonitorQuery } from './queries/findAll/findAllMonitor.query';
import { FindOneMonitorQuery } from './queries/findOne/findOneMonitor.query';
import { CreateMonitorCommand } from './commands/create/createMonitor.command';
import { UpdateMonitorCommand } from './commands/update/updateMonitor.command';
import { DeleteMonitorCommand } from './commands/delete/deleteMonitor.command';

@Controller('monitor')
@UseGuards(RolesGuard)
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateMonitorCredentialsPipe())
  create(@Body() monitorDto: CreateMonitorDto) {
    const command = plainToClass(CreateMonitorCommand, monitorDto);
    return this.commandBus.execute(command);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllMonitorQuery, {});
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneMonitorQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() monitorDto: UpdateMonitorDto) {
    const command = plainToClass(UpdateMonitorCommand, monitorDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteMonitorCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
