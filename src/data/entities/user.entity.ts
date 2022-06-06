import { IsNotEmpty } from 'class-validator';
import { RoleEntity, ScheduleEntity } from '../entities';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../interfaces';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @ManyToOne(() => RoleEntity, role => role.users)
  role: RoleEntity;

  @OneToMany(() => ScheduleEntity, schedule => schedule.user)
  schedules!: ScheduleEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
