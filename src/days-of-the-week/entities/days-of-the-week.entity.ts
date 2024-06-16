import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('days_of_the_week')
export class DaysOfTheWeekEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'days_week', nullable: false })
  daysWeek: string;
}
