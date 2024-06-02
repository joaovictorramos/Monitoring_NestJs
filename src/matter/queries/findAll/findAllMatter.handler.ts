/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMatterQuery } from './findAllMatter.query';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindAllMatterQuery)
export class FindAllMatterHandler
  implements IQueryHandler<FindAllMatterHandler, Array<MatterEntity>>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async execute(query: FindAllMatterQuery): Promise<Array<MatterEntity>> {
    const matters = await this.matterRepository.find();
    if (!matters.length) {
      throw new NotFoundException('No mattera found');
    }
    return matters;
  }
}
