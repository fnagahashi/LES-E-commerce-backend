import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779492450863 implements MigrationInterface {
    name = 'AutoMigration1779492450863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chatMessage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL, "sessionId" uuid, CONSTRAINT "PK_f318e92056e16b5b477cf17dc3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatSession" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "startedAt" TIMESTAMP NOT NULL, "clientId" uuid, CONSTRAINT "PK_d3875d18bcdc56c18432ab50d72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "book" ADD "level" character varying`);
        await queryRunner.query(`ALTER TABLE "book" ADD "keywords" text`);
        await queryRunner.query(`ALTER TABLE "order" ADD "chatRecommendatioUsed" boolean`);
        await queryRunner.query(`ALTER TABLE "chatMessage" ADD CONSTRAINT "FK_f303d669d2ef6fdd7f9676bc6f0" FOREIGN KEY ("sessionId") REFERENCES "chatSession"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatSession" ADD CONSTRAINT "FK_d0f458d9dbd7203831c18d02197" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatSession" DROP CONSTRAINT "FK_d0f458d9dbd7203831c18d02197"`);
        await queryRunner.query(`ALTER TABLE "chatMessage" DROP CONSTRAINT "FK_f303d669d2ef6fdd7f9676bc6f0"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "chatRecommendatioUsed"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "level"`);
        await queryRunner.query(`DROP TABLE "chatSession"`);
        await queryRunner.query(`DROP TABLE "chatMessage"`);
    }

}
