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
import { AbsenceService } from './absence.service';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { UpdateAbsenceDto } from './dto/update-absence.dto';
import { ValidateAbsenceCredentialsPipe } from './pipes/absence.pipes';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Post()
  @UsePipes(new ValidateAbsenceCredentialsPipe())
  create(@Body() createAbsenceDto: CreateAbsenceDto) {
    return this.absenceService.create(createAbsenceDto);
  }

  @Get()
  findAll() {
    return this.absenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.absenceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbsenceDto: UpdateAbsenceDto) {
    return this.absenceService.update(id, updateAbsenceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.absenceService.remove(id);
  }
}
