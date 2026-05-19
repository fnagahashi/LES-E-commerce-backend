import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779123737352 implements MigrationInterface {
    name = 'AutoMigration1779123737352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItem" ADD "exchangeRequested" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "orderItem" ADD "exchangeQuantity" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orderItem" DROP COLUMN "exchangeQuantity"`);
        await queryRunner.query(`ALTER TABLE "orderItem" DROP COLUMN "exchangeRequested"`);
    }

}
