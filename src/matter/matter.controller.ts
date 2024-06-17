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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('matter')
@Controller('matter')
@UseGuards(RolesGuard)
export class MatterController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create matter',
    description: 'Method responsible for creating matters',
  })
  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateMatterCredentialsPipe())
  create(@Body() matterDto: CreateMatterDto) {
    const command = plainToClass(CreateMatterCommand, matterDto);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for matters',
    description: 'Method responsible for searching for matters',
  })
  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllMatterQuery, {});
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search matter by id',
    description: 'Method responsible for searching matter by id',
  })
  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneMatterQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update matter',
    description: 'Method responsible for updating matters',
  })
  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() matterDto: UpdateMatterDto) {
    const command = plainToClass(UpdateMatterCommand, matterDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete matter',
    description: 'Method responsible for deleting matters',
  })
  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteMatterCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
