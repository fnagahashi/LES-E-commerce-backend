import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1774111952694 implements MigrationInterface {
    name = 'AutoMigration1774111952694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "addressNickname" character varying `);
        await queryRunner.query(`ALTER TABLE "address" ADD "isDeliveryAddress" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "address" ADD "isBillingAddress" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "creditCard" ADD "cardHolderName" character varying `);
        await queryRunner.query(`ALTER TABLE "creditCard" ADD "isMainCard" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creditCard" ALTER COLUMN "cardExpirationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creditCard" DROP COLUMN "isMainCard"`);
        await queryRunner.query(`ALTER TABLE "creditCard" DROP COLUMN "cardHolderName"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "isBillingAddress"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "isDeliveryAddress"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "addressNickname"`);
    }

}
