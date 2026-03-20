import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1774044095314 implements MigrationInterface {
    name = 'AutoMigration1774044095314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "confirmPassword"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "confirmPassword" character varying NOT NULL`);
    }

}
