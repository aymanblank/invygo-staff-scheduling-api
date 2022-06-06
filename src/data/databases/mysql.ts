import { join } from 'path';
import { DataSource } from 'typeorm';
import { UserEntity, RoleEntity, PermissionEntity, ScheduleEntity } from '../entities';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '../../config';

export const MySQLDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [UserEntity, RoleEntity, PermissionEntity, ScheduleEntity],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
});
