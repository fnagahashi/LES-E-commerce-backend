import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775486473450 implements MigrationInterface {
    name = 'AutoMigration1775486473450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cupom" DROP COLUMN "cupomValue"`);
        await queryRunner.query(`ALTER TABLE "cupom" ADD "cupomValue" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creditCard" ALTER COLUMN "cardHolderName" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creditCard" ALTER COLUMN "cardHolderName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cupom" DROP COLUMN "cupomValue"`);
        await queryRunner.query(`ALTER TABLE "cupom" ADD "cupomValue" integer NOT NULL`);
    }

}
