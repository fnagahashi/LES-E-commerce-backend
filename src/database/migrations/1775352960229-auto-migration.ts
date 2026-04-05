import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775352960229 implements MigrationInterface {
    name = 'AutoMigration1775352960229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "quantityStock"`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "addressNickname" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "addressNickname" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book" ADD "quantityStock" integer NOT NULL`);
    }

}
