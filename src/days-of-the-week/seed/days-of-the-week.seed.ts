import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DaysOfTheWeekEntity } from '../entities/days-of-the-week.entity';

@Injectable()
export class DaysOfTheWeekSeed implements OnModuleInit {
  constructor(
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const daysOfTheWeekTable = await this.daysOfTheWeekRepository.count();
    if (daysOfTheWeekTable === 0) {
      const daysOfTheWeeks = [
        { daysWeek: 'DOMINGO' },
        { daysWeek: 'SEGUNDA-FEIRA' },
        { daysWeek: 'TERÇA-FEIRA' },
        { daysWeek: 'QUARTA-FEIRA' },
        { daysWeek: 'QUINTA-FEIRA' },
        { daysWeek: 'SEXTA-FEIRA' },
        { daysWeek: 'SÁBADO' },
      ];

      const daysOfTheWeekEntities = daysOfTheWeeks.map((data) => {
        const daysOfTheWeek = new DaysOfTheWeekEntity();
        daysOfTheWeek.daysWeek = data.daysWeek;
        return daysOfTheWeek;
      });

      await this.daysOfTheWeekRepository.save(daysOfTheWeekEntities);
    }
  }
}
