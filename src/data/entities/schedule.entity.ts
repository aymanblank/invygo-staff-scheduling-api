import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '../entities';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Schedule } from '../../interfaces';

@Entity()
export class ScheduleEntity extends BaseEntity implements Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  date: string;

  @Column('int')
  @IsNotEmpty()
  shiftLength: number;

  @ManyToOne(() => UserEntity, user => user.schedules)
  user: UserEntity;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
