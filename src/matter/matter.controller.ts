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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FindAllMatterQuery } from './queries/findAll/findAllMatter.query';
import { FindOneMatterQuery } from './queries/findOne/findOneMatter.query';
import { CreateMatterCommand } from './commands/create/CreateMatter.command';
import { UpdateMatterCommand } from './commands/update/updateMatter.command';
import { DeleteMatterCommand } from './commands/delete/deleteMatter.command';

@Controller('matter')
@UseGuards(RolesGuard)
export class MatterController {
  constructor(
    private readonly matterService: MatterService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateMatterCredentialsPipe())
  create(@Body() matterDto: CreateMatterDto) {
    const command = plainToClass(CreateMatterCommand, matterDto);
    return this.commandBus.execute(command);
  }

  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllMatterQuery, {});
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneMatterQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() matterDto: UpdateMatterDto) {
    const command = plainToClass(UpdateMatterCommand, matterDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteMatterCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
