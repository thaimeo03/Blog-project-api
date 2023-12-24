import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexUserImagePostTables1703400850693 implements MigrationInterface {
    name = 'AddIndexUserImagePostTables1703400850693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image\` ADD UNIQUE INDEX \`IDX_602959dc3010ff4b4805ee7f10\` (\`url\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_03585d421deb10bbc326fffe4c\` (\`refreshToken\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\` (\`title\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e28aa0c4114146bfb1567bfa9a\` ON \`post\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_03585d421deb10bbc326fffe4c\``);
        await queryRunner.query(`ALTER TABLE \`image\` DROP INDEX \`IDX_602959dc3010ff4b4805ee7f10\``);
    }

}
