import { AbsenceEntity } from 'src/absence/entities/absence.entity';
import { ClassroomEntity } from 'src/classroom/entities/classroom.entity';
import { DaysOfTheWeekEntity } from 'src/days-of-the-week/entities/days-of-the-week.entity';
import { MatterEntity } from 'src/matter/entities/matter.entity';
import { UsersEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column({ name: 'type_of_monitoring', nullable: false })
  typeOfMonitoring: string;

  @Column({ name: 'start_hour', type: 'time', nullable: false })
  startHour: string;

  @Column({ name: 'end_hour', type: 'time', nullable: false })
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

  @ManyToOne(() => UsersEntity, (users) => users.monitors, { nullable: false })
  @JoinColumn({ name: 'users_id' })
  usersId: UsersEntity;

  @ManyToOne(() => ClassroomEntity, (classroom) => classroom.monitors)
  @JoinColumn({ name: 'classroom_id' })
  classroomId: ClassroomEntity;

  @ManyToOne(() => MatterEntity, (matter) => matter.monitors, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matter_id' })
  matterId: MatterEntity;

  @ManyToMany(
    () => DaysOfTheWeekEntity,
    (daysOfTheWeek) => daysOfTheWeek.monitorIds,
    { cascade: true },
  )
  @JoinTable({
    name: 'monitor_days_of_the_week',
    joinColumn: {
      name: 'monitor_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'days_of_the_week_id',
      referencedColumnName: 'id',
    },
  })
  daysOfTheWeekIds: DaysOfTheWeekEntity[];

  @OneToMany(() => AbsenceEntity, (absences) => absences.monitorId)
  absences: AbsenceEntity[];
}
