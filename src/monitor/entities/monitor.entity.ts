import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('monitor')
export class MonitorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  registration: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'actual_period' })
  actualPeriod: number;

  @Column({ name: 'institutional_email', nullable: false })
  institutionalEmail: string;

  @Column({ name: 'type_of_monitoring' })
  typeOfMonitoring: string;

  @Column({ name: 'days_of_the_week' })
  daysOfTheWeek: string;

  @Column({ name: 'start_hour', type: 'time' })
  startHour: string;

  @Column({ name: 'end_hour', type: 'time' })
  endHour: string;

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

  @ManyToOne(() => UsersEntity, (users) => users.monitors)
  @JoinColumn({ name: 'users_id' })
  usersId: UsersEntity;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.monitors)
  @JoinColumn({ name: 'classroom_id' })
  classroomId: ClassroomEntity;

  @ManyToOne(() => MatterEntity, (matter) => matter.monitors)
  @JoinColumn({ name: 'matter_id' })
  matterId: MatterEntity;
}
