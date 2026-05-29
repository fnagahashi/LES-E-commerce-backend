import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779830336870 implements MigrationInterface {
    name = 'AutoMigration1779830336870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatSession" DROP CONSTRAINT "FK_d0f458d9dbd7203831c18d02197"`);
        await queryRunner.query(`ALTER TABLE "chatMessage" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."chatMessage_role_enum" AS ENUM('user', 'assistant', 'system')`);
        await queryRunner.query(`ALTER TABLE "chatMessage" ADD "role" "public"."chatMessage_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chatMessage" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "chatSession" ALTER COLUMN "startedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "chatSession" ADD CONSTRAINT "FK_d0f458d9dbd7203831c18d02197" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatSession" DROP CONSTRAINT "FK_d0f458d9dbd7203831c18d02197"`);
        await queryRunner.query(`ALTER TABLE "chatSession" ALTER COLUMN "startedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chatMessage" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "chatMessage" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."chatMessage_role_enum"`);
        await queryRunner.query(`ALTER TABLE "chatMessage" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chatSession" ADD CONSTRAINT "FK_d0f458d9dbd7203831c18d02197" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
