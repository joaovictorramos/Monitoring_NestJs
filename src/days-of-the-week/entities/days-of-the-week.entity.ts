import { MatterEntity } from 'src/matter/entities/matter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @OneToMany(() => MatterEntity, (matters) => matters.daysOfTheWeekId)
  matters: MatterEntity[];
}
