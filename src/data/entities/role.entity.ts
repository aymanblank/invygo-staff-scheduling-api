import { IsNotEmpty } from 'class-validator';
import { UserEntity, PermissionEntity } from '../entities';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Role } from '../../interfaces';

@Entity()
export class RoleEntity extends BaseEntity implements Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['name'])
  name: string;

  @OneToMany(() => UserEntity, user => user.role)
  users!: UserEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable()
  permissions!: PermissionEntity[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
