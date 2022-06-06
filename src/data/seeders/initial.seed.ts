import { QueryRunner } from 'typeorm';
import { hash } from 'bcryptjs';
import { PERMISSIONS, ROLES } from '../../config';
import { PermissionEntity, RoleEntity, UserEntity } from '../entities';

class InitialSeeder {
  public async seedPermissions(queryRunner: QueryRunner): Promise<void> {
    // Initiate Repository
    const permissionRepository = queryRunner.manager.getRepository(PermissionEntity);
    // Loop through all permissions and insert it into db
    const permissionPromises = Object.values(PERMISSIONS).map((permission: string) => permissionRepository.create({ title: permission }).save());
    await Promise.all(permissionPromises);
  }

  public async seedRoles(queryRunner: QueryRunner): Promise<void> {
    // Initiate Repositories
    const roleRepository = queryRunner.manager.getRepository(RoleEntity);
    const permissionRepository = queryRunner.manager.getRepository(PermissionEntity);

    // Loop through all roles and insert it into db
    const rolePromises = Object.values(ROLES).map(async role => {
      const rolePermissions: PermissionEntity[] = [];
      const rolePermissionsPromises = role.permissions?.map(async permission => {
        const permissionEntity = await permissionRepository.findOne({ where: { title: permission.title } });
        rolePermissions.push(permissionEntity);
      });
      await Promise.all(rolePermissionsPromises);
      await roleRepository.create({ name: role.name, permissions: rolePermissions }).save();
    });
    await Promise.all(rolePromises);
  }

  public async seedUsers(queryRunner: QueryRunner): Promise<void> {
    // Initiate Repositories
    const userRepository = queryRunner.manager.getRepository(UserEntity);
    const roleRepository = queryRunner.manager.getRepository(RoleEntity);

    // Finding Admin Role
    const roleEntity = await roleRepository.findOne({ where: { name: 'ADMIN' } });

    const hashedPassword = await hash('invyg0P@ss', 10);

    // Creating Admin User
    await userRepository.create({ name: 'admin', email: 'admin@invygo.com', password: hashedPassword, role: roleEntity }).save();
  }
}

const initialSeeder = new InitialSeeder();
export { initialSeeder };
