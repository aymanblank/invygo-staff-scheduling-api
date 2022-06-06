import { MigrationInterface, QueryRunner } from 'typeorm';
import { initialSeeder } from '../seeders';

export class InitialMigration1656619200000 implements MigrationInterface {
  name = 'InitialMigration1656619200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`roleId\` int NULL, UNIQUE INDEX \`IDX_415c35b9b3b6fe45a3b065030f\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedule_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` varchar(255) NOT NULL, \`shiftLength\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_entity_permissions_permission_entity\` (\`roleEntityId\` int NOT NULL, \`permissionEntityId\` int NOT NULL, INDEX \`IDX_c58c915f7dfc3b9d6746d4a318\` (\`roleEntityId\`), INDEX \`IDX_c18b1176211a6a9ce8c5818931\` (\`permissionEntityId\`), PRIMARY KEY (\`roleEntityId\`, \`permissionEntityId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_entity\` ADD CONSTRAINT \`FK_95ab8e7157a5bb4bc0e51aefdd2\` FOREIGN KEY (\`roleId\`) REFERENCES \`role_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedule_entity\` ADD CONSTRAINT \`FK_9c227fdc3ea62bfe822bdb01d08\` FOREIGN KEY (\`userId\`) REFERENCES \`user_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_entity_permissions_permission_entity\` ADD CONSTRAINT \`FK_c58c915f7dfc3b9d6746d4a3188\` FOREIGN KEY (\`roleEntityId\`) REFERENCES \`role_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_entity_permissions_permission_entity\` ADD CONSTRAINT \`FK_c18b1176211a6a9ce8c5818931c\` FOREIGN KEY (\`permissionEntityId\`) REFERENCES \`permission_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    await initialSeeder.seedPermissions(queryRunner);
    await initialSeeder.seedRoles(queryRunner);
    await initialSeeder.seedUsers(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`role_entity_permissions_permission_entity\` DROP FOREIGN KEY \`FK_c18b1176211a6a9ce8c5818931c\``);
    await queryRunner.query(`ALTER TABLE \`role_entity_permissions_permission_entity\` DROP FOREIGN KEY \`FK_c58c915f7dfc3b9d6746d4a3188\``);
    await queryRunner.query(`ALTER TABLE \`schedule_entity\` DROP FOREIGN KEY \`FK_9c227fdc3ea62bfe822bdb01d08\``);
    await queryRunner.query(`ALTER TABLE \`user_entity\` DROP FOREIGN KEY \`FK_95ab8e7157a5bb4bc0e51aefdd2\``);
    await queryRunner.query(`DROP INDEX \`IDX_c18b1176211a6a9ce8c5818931\` ON \`role_entity_permissions_permission_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_c58c915f7dfc3b9d6746d4a318\` ON \`role_entity_permissions_permission_entity\``);
    await queryRunner.query(`DROP TABLE \`role_entity_permissions_permission_entity\``);
    await queryRunner.query(`DROP TABLE \`schedule_entity\``);
    await queryRunner.query(`DROP TABLE \`permission_entity\``);
    await queryRunner.query(`DROP TABLE \`role_entity\``);
    await queryRunner.query(`DROP INDEX \`IDX_415c35b9b3b6fe45a3b065030f\` ON \`user_entity\``);
    await queryRunner.query(`DROP TABLE \`user_entity\``);
  }
}
