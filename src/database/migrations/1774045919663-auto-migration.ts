import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1774045919663 implements MigrationInterface {
    name = 'AutoMigration1774045919663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creditCard" ADD "cardExpirationDate" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."client_role_enum" AS ENUM('ADMIN', 'CLIENT')`);
        await queryRunner.query(`ALTER TABLE "client" ADD "role" "public"."client_role_enum" NOT NULL DEFAULT 'CLIENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."client_role_enum"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "creditCard" DROP COLUMN "cardExpirationDate"`);
    }

}
