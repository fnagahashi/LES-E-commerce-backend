import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765047297383 implements MigrationInterface {
    name = 'AutoMigration1765047297383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_5eb580fe5d5ad62c497c2967b1f"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "UQ_5eb580fe5d5ad62c497c2967b1f"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "policyId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ADD "policyId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "UQ_5eb580fe5d5ad62c497c2967b1f" UNIQUE ("policyId")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_5eb580fe5d5ad62c497c2967b1f" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
