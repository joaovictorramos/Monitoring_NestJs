import { Module } from '@nestjs/common';
import { MatterService } from './matter.service';
import { MatterController } from './matter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatterEntity } from './entities/matter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatterEntity])],
  controllers: [MatterController],
  providers: [MatterService],
})
export class MatterModule {}
