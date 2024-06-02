/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMatterQuery } from './findOneMatter.query';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';

@QueryHandler(FindOneMatterQuery)
export class FindOneMatterHandler
  implements IQueryHandler<FindOneMatterQuery, MatterEntity | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async execute(query: FindOneMatterQuery): Promise<MatterEntity> {
    const matter = await this.matterRepository.findOne({
      where: { id: query.id },
    });
    if (!matter) {
      throw new NotFoundException('No matter found');
    }
    return matter;
  }
}
