import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CachesService } from './caches.service';
import { CreateCachesDto } from './dto/create-caches.dto';
import { UpdateCachesDto } from './dto/update-caches.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('caches')
export class CachesController {
  constructor(private readonly cachesService: CachesService) {}

  @Post()
  create(@Body() createCachDto: CreateCachesDto) {
    return this.cachesService.create(createCachDto);
  }

  @Get()
  findAll() {
    return this.cachesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cachesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCachDto: UpdateCachesDto) {
    return this.cachesService.update(+id, updateCachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cachesService.remove(+id);
  }
}
