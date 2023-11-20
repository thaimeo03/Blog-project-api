import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUserTable1700494518258 implements MigrationInterface {
    name = 'AddRefreshTokenToUserTable1700494518258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refreshToken\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refreshToken\``);
    }

}
