import { Module } from '@nestjs/common';
import { MatterService } from './matter.service';
import { MatterController } from './matter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatterEntity } from './entities/matter.entity';
import { CachesModule } from 'src/caches/caches.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatterEntity]), CachesModule],
  controllers: [MatterController],
  providers: [MatterService],
  exports: [MatterService],
})
export class MatterModule {}
