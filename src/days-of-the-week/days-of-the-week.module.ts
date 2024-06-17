import { Module } from '@nestjs/common';
import { DaysOfTheWeekController } from './days-of-the-week.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaysOfTheWeekEntity } from './entities/days-of-the-week.entity';
import { CachesModule } from 'src/caches/caches.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [
    TypeOrmModule.forFeature([DaysOfTheWeekEntity]),
    CachesModule,
    CqrsModule,
  ],
  controllers: [DaysOfTheWeekController],
  providers: [DaysOfTheWeekController, ...QueryHandlers, ...CommandHandlers],
  exports: [DaysOfTheWeekController],
})
export class DaysOfTheWeekModule {}
