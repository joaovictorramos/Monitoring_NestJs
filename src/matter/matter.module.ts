import { Module } from '@nestjs/common';
import { MatterService } from './matter.service';
import { MatterController } from './matter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatterEntity } from './entities/matter.entity';
import { CachesModule } from 'src/caches/caches.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [TypeOrmModule.forFeature([MatterEntity]), CachesModule, CqrsModule],
  controllers: [MatterController],
  providers: [MatterService, ...QueryHandlers, ...CommandHandlers],
  exports: [MatterService],
})
export class MatterModule {}
