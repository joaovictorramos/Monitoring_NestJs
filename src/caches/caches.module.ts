import { Module } from '@nestjs/common';
import { CachesService } from './caches.service';
import { CachesController } from './caches.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [CachesController],
  providers: [CachesService],
  exports: [CachesService],
})
export class CachesModule {}
