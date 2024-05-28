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

@Controller('monitor')
@UseGuards(RolesGuard)
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateMonitorCredentialsPipe())
  create(@Body() monitorDto: CreateMonitorDto) {
    return this.monitorService.create(monitorDto);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    return this.monitorService.findAll();
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    return this.monitorService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() monitorDto: UpdateMonitorDto) {
    return this.monitorService.update(id, monitorDto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.monitorService.remove(id);
  }
}
