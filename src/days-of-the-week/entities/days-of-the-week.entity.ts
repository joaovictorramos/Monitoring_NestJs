import { MatterEntity } from 'src/matter/entities/matter.entity';
import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('days_of_the_week')
export class DaysOfTheWeekEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'days_week', nullable: false })
  daysWeek: string;

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

  @ManyToMany(() => MonitorEntity, (monitor) => monitor.daysOfTheWeekIds)
  @JoinColumn({ name: 'monitor_id' })
  monitorIds: MonitorEntity[];

  @OneToMany(() => MatterEntity, (matters) => matters.daysOfTheWeekId)
  matters: MatterEntity[];
}
