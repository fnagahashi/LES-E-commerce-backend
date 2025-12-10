import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765404625530 implements MigrationInterface {
    name = 'AutoMigration1765404625530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6bb61cbede7c869adde5587f345" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6bb61cbede7c869adde5587f345" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
