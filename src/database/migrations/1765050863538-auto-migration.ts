import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765050863538 implements MigrationInterface {
    name = 'AutoMigration1765050863538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "guestId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3"`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ALTER COLUMN "guestId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
