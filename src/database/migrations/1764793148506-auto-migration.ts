import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1764793148506 implements MigrationInterface {
    name = 'AutoMigration1764793148506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "priceTotal"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "reservationId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_6bb61cbede7c869adde5587f345" UNIQUE ("reservationId")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "saleId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "UQ_a172e782f4b04c62610e3dcd208" UNIQUE ("saleId")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "policyId" uuid`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "UQ_5eb580fe5d5ad62c497c2967b1f" UNIQUE ("policyId")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6bb61cbede7c869adde5587f345" FOREIGN KEY ("reservationId") REFERENCES "reservation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_a172e782f4b04c62610e3dcd208" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_5eb580fe5d5ad62c497c2967b1f" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_5eb580fe5d5ad62c497c2967b1f"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_a172e782f4b04c62610e3dcd208"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "UQ_5eb580fe5d5ad62c497c2967b1f"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "policyId"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "UQ_a172e782f4b04c62610e3dcd208"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP COLUMN "saleId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_6bb61cbede7c869adde5587f345"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "reservationId"`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "paymentStatus" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD "priceTotal" numeric(10,2) NOT NULL`);
    }

}
