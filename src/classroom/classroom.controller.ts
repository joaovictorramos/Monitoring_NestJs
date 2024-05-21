import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomEntity } from './entities/classroom.entity';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  create(@Body() classroomDto: CreateClassroomDto) {
    return this.classroomService.create(classroomDto);
  }

  @Get()
  findAll() {
    return this.classroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() classrooomDto: Partial<UpdateClassroomDto>,
  ): Promise<ClassroomEntity> {
    return this.classroomService.update(id, classrooomDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.classroomService.remove(id);
  }
}
