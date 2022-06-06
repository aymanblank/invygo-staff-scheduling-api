import { MySQLDataSource } from '../databases';
import { ScheduleEntity } from '../entities';

export const ScheduleRepository = MySQLDataSource.getRepository(ScheduleEntity).extend({
  findByIdWithRelations(id: number): Promise<ScheduleEntity> {
    return this.findOne({ where: { id: id }, relations: { user: true } });
  },
});
