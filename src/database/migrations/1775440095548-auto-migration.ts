import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775440095548 implements MigrationInterface {
    name = 'AutoMigration1775440095548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cupom" DROP COLUMN "cupomValue"`);
        await queryRunner.query(`ALTER TABLE "cupom" ADD "cupomValue" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cupom" DROP COLUMN "cupomValue"`);
        await queryRunner.query(`ALTER TABLE "cupom" ADD "cupomValue" integer NOT NULL`);
    }

}
