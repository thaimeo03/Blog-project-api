import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRefreshTokenToUserTable1700494656196 implements MigrationInterface {
    name = 'FixRefreshTokenToUserTable1700494656196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NOT NULL`);
    }

}
