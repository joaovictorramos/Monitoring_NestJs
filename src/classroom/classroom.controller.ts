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
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';
import { RolesGuard } from 'src/auth/auth.roles';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { ValidateClassroomCredentialsPipe } from './pipes/classroom.pipes';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { FindAllClassroomQuery } from './queries/findAll/findAllClassroom.query';
import { FindOneClassroomQuery } from './queries/findOne/findOneClassroom.query';
import { CreateClassroomCommand } from './commands/create/createClassroom.command';
import { UpdateClassroomCommand } from './commands/update/updateClassroom.command';
import { DeleteClassroomCommand } from './commands/delete/DeleteClassroom.command';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('classroom')
@Controller('classroom')
@UseGuards(RolesGuard)
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create classroom',
    description: 'Method responsible for creating classrooms',
  })
  @Post()
  @Roles(Role.PROFESSOR)
  @UsePipes(new ValidateClassroomCredentialsPipe())
  create(@Body() classroomDto: CreateClassroomDto) {
    const command = plainToClass(CreateClassroomCommand, classroomDto);
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search for clasrooms',
    description: 'Method responsible for searching for classrooms',
  })
  @Get()
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findAll() {
    const query = plainToClass(FindAllClassroomQuery, {});
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search classroom by id',
    description: 'Method responsible for searching classroom by id',
  })
  @Get(':id')
  @Roles(Role.PROFESSOR, Role.ALUNO)
  findOne(@Param('id') id: string) {
    const query = plainToClass(FindOneClassroomQuery, { id: id });
    return this.queryBus.execute(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update classroom',
    description: 'Method responsible for updating classrooms',
  })
  @Patch(':id')
  @Roles(Role.PROFESSOR)
  update(
    @Param('id') id: string,
    @Body() classrooomDto: UpdateClassroomDto,
  ): Promise<ClassroomEntity> {
    const command = plainToClass(UpdateClassroomCommand, classrooomDto);
    command.idPath = id;
    return this.commandBus.execute(command);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete classroom',
    description: 'Method responsible for deleting classrooms',
  })
  @Delete(':id')
  @Roles(Role.PROFESSOR)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const command = plainToClass(DeleteClassroomCommand, { id: id });
    command.idPath = id;
    return this.commandBus.execute(command);
  }
}
