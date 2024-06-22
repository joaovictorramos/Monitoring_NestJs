import { Module } from '@nestjs/common';
import { MatterController } from './matter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatterEntity } from './entities/matter.entity';
import { CachesModule } from 'src/caches/caches.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { DaysOfTheWeekModule } from 'src/days-of-the-week/days-of-the-week.module';
import { MatterSeed } from './seed/matter.seed';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatterEntity, DaysOfTheWeekEntity]),
    DaysOfTheWeekModule,
    CachesModule,
    CqrsModule,
  ],
  controllers: [MatterController],
  providers: [
    MatterController,
    MatterSeed,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [MatterController],
})
export class MatterModule {}
