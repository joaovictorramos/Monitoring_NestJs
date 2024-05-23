import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorEntity } from './entities/monitor.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorEntity]), UsersModule],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}
