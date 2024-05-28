import { ValidateMatterCredentialsPipe } from './pipes/matter.pipes';
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
import { MatterService } from './matter.service';
import { CreateMatterDto } from './dto/create-matter.dto';
import { UpdateMatterDto } from './dto/update-matter.dto';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('matter')
@UseGuards(RolesGuard)
export class MatterController {
  constructor(private readonly matterService: MatterService) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateMatterCredentialsPipe())
  create(@Body() matterDto: CreateMatterDto) {
    return this.matterService.create(matterDto);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    return this.matterService.findAll();
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    return this.matterService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() matterDto: UpdateMatterDto) {
    return this.matterService.update(id, matterDto);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.matterService.remove(id);
  }
}
