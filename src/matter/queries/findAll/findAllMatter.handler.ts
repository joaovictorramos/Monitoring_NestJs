/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMatterQuery } from './findAllMatter.query';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from 'src/exceptions/entity.exceptions';
import { MatterReturnDto } from 'src/matter/dto/return-matter.dto';

@QueryHandler(FindAllMatterQuery)
export class FindAllMatterHandler
  implements IQueryHandler<FindAllMatterHandler, Array<MatterReturnDto>>
{
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
  ) {}

  async execute(query: FindAllMatterQuery): Promise<Array<MatterReturnDto>> {
    const matters = await this.matterRepository.find({
      relations: ['daysOfTheWeekId'],
    });
    if (!matters.length) {
      throw new NotFoundException('No mattera found');
    }
    return matters.map((matter) => {
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
    });
  }
}
