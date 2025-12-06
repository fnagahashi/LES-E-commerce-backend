import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765054003808 implements MigrationInterface {
    name = 'AutoMigration1765054003808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "noShow" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "noShow" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "noShow" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "noShow" SET NOT NULL`);
    }

}
