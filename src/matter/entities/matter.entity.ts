import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('matter')
export class MatterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  teacher: string;

  @Column({ nullable: false })
  type: string;

  @Column()
  period: number;

  @Column({ name: 'start_hour', type: 'time', nullable: false })
  startHour: string;

  @Column({ name: 'end_hour', type: 'time', nullable: false })
  endHour: string;

  @Column({ name: 'days_of_the_week', nullable: false })
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

  @OneToMany(() => MonitorEntity, (monitors) => monitors.matterId)
  monitors: MonitorEntity[];
}
