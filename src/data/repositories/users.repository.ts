import { MySQLDataSource } from '../databases';
import { UserEntity } from '../entities';

export const UserRepository = MySQLDataSource.getRepository(UserEntity).extend({
  findByIdWithRelations(id: number): Promise<UserEntity> {
    return this.findOne({ where: { id: id }, relations: { role: { permissions: true } } });
  },
});
