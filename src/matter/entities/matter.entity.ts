import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('matter')
export class MatterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  teacher: string;

  @Column()
  type: string;

  @Column()
  period: number;

  @Column({ name: 'start_hour', type: 'time' })
  startHour: string;

  @Column({ name: 'end_hour', type: 'time' })
  endHour: string;

  @Column({ name: 'days_of_the_week' })
  daysOfTheWeek: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
