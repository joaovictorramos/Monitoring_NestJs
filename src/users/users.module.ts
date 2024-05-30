import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CachesModule } from 'src/caches/caches.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), CachesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
