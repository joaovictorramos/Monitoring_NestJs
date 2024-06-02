import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CachesModule } from 'src/caches/caches.module';
import { QueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), CachesModule, CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, ...QueryHandlers, ...CommandHandlers],
  exports: [UsersService],
})
export class UsersModule {}
