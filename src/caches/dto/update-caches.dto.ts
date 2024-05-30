import { PartialType } from '@nestjs/mapped-types';
import { CreateCachesDto } from './create-caches.dto';

export class UpdateCachesDto extends PartialType(CreateCachesDto) {}
