import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { CachesModule } from 'src/caches/caches.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassroomEntity]), CachesModule],
  controllers: [ClassroomController],
  providers: [ClassroomService],
  exports: [ClassroomService],
})
export class ClassroomModule {}
