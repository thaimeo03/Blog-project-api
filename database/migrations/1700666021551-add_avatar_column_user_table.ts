import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarColumnUserTable1700666021551 implements MigrationInterface {
    name = 'AddAvatarColumnUserTable1700666021551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
