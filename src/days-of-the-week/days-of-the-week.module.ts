import { Module } from '@nestjs/common';
import { DaysOfTheWeekController } from './days-of-the-week.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaysOfTheWeekEntity } from './entities/days-of-the-week.entity';
import { CachesModule } from 'src/caches/caches.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { DaysOfTheWeekSeed } from './seed/days-of-the-week.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysOfTheWeekEntity]),
    CachesModule,
    CqrsModule,
  ],
  controllers: [DaysOfTheWeekController],
  providers: [
    DaysOfTheWeekController,
    DaysOfTheWeekSeed,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [DaysOfTheWeekController, ...QueryHandlers],
})
export class DaysOfTheWeekModule {}
