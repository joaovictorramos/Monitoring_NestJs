import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MatterEntity } from '../entities/matter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';

@Injectable()
export class MatterSeed implements OnModuleInit {
  constructor(
    @InjectRepository(MatterEntity)
    private readonly matterRepository: Repository<MatterEntity>,
    @InjectRepository(DaysOfTheWeekEntity)
    private readonly daysOfTheWeekRepository: Repository<DaysOfTheWeekEntity>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const daysOfTheWeeks = await this.daysOfTheWeekRepository.find();
    const matterTable = await this.matterRepository.count();
    if (matterTable === 0) {
      const matters = [
        {
          name: 'Sistemas Especialistas',
          teacher: 'Carlos Eduardo Pantoja',
          type: 'OBRIGATÓRIA',
          period: 7,
          startHour: '18:00:00',
          endHour: '21:40:00',
          daysOfTheWeekId: daysOfTheWeeks[1],
        },
        {
          name: 'Gestão de Projetos de Software',
          teacher: 'Vladimir Marques Erthal',
          type: 'OBRIGATÓRIA',
          period: 7,
          startHour: '18:00:00',
          endHour: '21:40:00',
          daysOfTheWeekId: daysOfTheWeeks[2],
        },
        {
          name: 'Qualidade de Software',
          teacher: 'Cintia Machado de Oliveira',
          type: 'OBRIGATÓRIA',
          period: 7,
          startHour: '18:00:00',
          endHour: '21:40:00',
          daysOfTheWeekId: daysOfTheWeeks[3],
        },
        {
          name: 'Desenvolvimento de Aplicativos',
          teacher: 'Cristiano Fuschilo',
          type: 'OBRIGATÓRIA',
          period: 7,
          startHour: '18:00:00',
          endHour: '21:40:00',
          daysOfTheWeekId: daysOfTheWeeks[4],
        },
        {
          name: 'Programação Web',
          teacher: 'Diego Cardoso Borda Castro',
          type: 'OBRIGATÓRIA',
          period: 7,
          startHour: '18:00:00',
          endHour: '21:40:00',
          daysOfTheWeekId: daysOfTheWeeks[5],
        },
      ];

      const matterEntities = matters.map((data) => {
        const matter = new MatterEntity();
        matter.name = data.name;
        matter.teacher = data.teacher;
        matter.type = data.type;
        matter.period = data.period;
        matter.startHour = data.startHour;
        matter.endHour = data.endHour;
        matter.daysOfTheWeekId = data.daysOfTheWeekId;
        return matter;
      });

      await this.matterRepository.save(matterEntities);
    }
  }
}
