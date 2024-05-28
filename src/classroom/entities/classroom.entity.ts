import { MonitorEntity } from 'src/monitor/entities/monitor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('classroom')
export class ClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  block: string;

  @Column()
  type: string;

  @Column({ name: 'is_reserved', default: () => 'FALSE' })
  isReserved: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @CreateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => MonitorEntity, (monitors) => monitors.classroomId)
  monitors: MonitorEntity[];
}
