/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { CreateCachesDto } from './dto/create-caches.dto';
import { UpdateCachesDto } from './dto/update-caches.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CachesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async retrieveData(bearer: string): Promise<string> {
    const value = await this.cacheManager.get<{ access_token?: string }>(
      bearer,
    );
    return value?.access_token || null;
  }

  async storeData(bearer: string): Promise<void> {
    await this.cacheManager.set(bearer, { access_token: bearer }, 200000);
  }

  create(cacheDto: CreateCachesDto) {
    return 'This action adds a new cache';
  }

  findAll() {
    return `This action returns all cache`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cache`;
  }

  update(id: number, cacheDto: UpdateCachesDto) {
    return `This action updates a #${id} cache`;
  }

  remove(id: number) {
    return `This action removes a #${id} cache`;
  }
}
