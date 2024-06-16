/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMatterQuery } from './findOneMatter.query';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { MatterReturnDto } from 'src/matter/dto/return-matter.dto';

@QueryHandler(FindOneMatterQuery)
export class FindOneMatterHandler
  implements IQueryHandler<FindOneMatterQuery, MatterReturnDto | null>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterReturnDto>,
  ) {}

  async execute(query: FindOneMatterQuery): Promise<MatterReturnDto> {
    const matter = await this.matterRepository.findOne({
      where: { id: query.id },
      relations: ['daysOfTheWeekId'],
    });
    if (!matter) {
      throw new NotFoundException('No matter found');
    }

    const matterReturnDto: MatterReturnDto = {
      id: matter.id,
      name: matter.name,
      teacher: matter.teacher,
      type: matter.type,
      period: matter.period,
      startHour: matter.startHour,
      endHour: matter.endHour,
      daysOfTheWeekId: matter.daysOfTheWeekId
        ? {
            id: matter.daysOfTheWeekId.id,
            daysWeek: matter.daysOfTheWeekId.daysWeek,
          }
        : null,
    };

    return matterReturnDto;
  }
}
