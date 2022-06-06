import { MySQLDataSource } from '../databases';
import { RoleEntity } from '../entities';

export const RoleRepository = MySQLDataSource.getRepository(RoleEntity).extend({
  findByIdWithRelations(id: number): Promise<RoleEntity> {
    return this.findOne({ where: { id: id }, relations: { permissions: true } });
  },
});
