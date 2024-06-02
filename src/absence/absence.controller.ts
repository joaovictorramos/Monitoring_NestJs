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
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { ValidateAbsenceCredentialsPipe } from './pipes/absence.pipes';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FindAllAbsenceQuery } from './queries/findAll/findAllAbsence.query';

@Controller('absence')
@UseGuards(RolesGuard)
export class AbsenceController {
  constructor(
    private readonly absenceService: AbsenceService,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateAbsenceCredentialsPipe())
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absenceService.create(createAbsenceDto);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllAbsenceQuery, {});
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absenceService.update(id, updateAbsenceDto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}
