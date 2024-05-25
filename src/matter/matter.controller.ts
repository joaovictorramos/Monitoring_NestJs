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
} from '@nestjs/common';
import { MatterService } from './matter.service';
import { CreateMatterDto } from './dto/create-matter.dto';
import { UpdateMatterDto } from './dto/update-matter.dto';

@Controller('matter')
export class MatterController {
  constructor(private readonly matterService: MatterService) {}

  @Post()
  @UsePipes(new ValidateMatterCredentialsPipe())
  create(@Body() matterDto: CreateMatterDto) {
    return this.matterService.create(matterDto);
  }

  @Get()
  findAll() {
    return this.matterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matterService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidateMatterCredentialsPipe())
  update(@Param('id') id: string, @Body() matterDto: UpdateMatterDto) {
    return this.matterService.update(id, matterDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.matterService.remove(id);
  }
}
