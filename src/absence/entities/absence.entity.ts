import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('absence')
export class AbsenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'date' })
  date: string;

  @Column({ nullable: true })
  justification: string;

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

  @ManyToOne(() => MonitorEntity, (monitor) => monitor.absences, {
    nullable: false,
  })
  @JoinColumn({ name: 'monitor_id' })
  monitorId: MonitorEntity;
}
