import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageTable1701702253644 implements MigrationInterface {
    name = 'AddImageTable1701702253644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`image\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(255) NOT NULL, \`public_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`image\``);
    }

}
