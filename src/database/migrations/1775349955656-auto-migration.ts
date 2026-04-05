import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775349955656 implements MigrationInterface {
  name = "AutoMigration1775349955656";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "quantityStock"`);
    await queryRunner.query(`
  UPDATE "creditCard"
  SET "cardHolderName" = 'Name not provided'
  WHERE "cardHolderName" IS NULL
`);
    await queryRunner.query(
      `ALTER TABLE "creditCard" ALTER COLUMN "cardExpirationDate" SET NOT NULL`,
    );
    await queryRunner.query(`
  UPDATE "creditCard"
  SET "cardExpirationDate" = '01/01/2000'
  WHERE "cardExpirationDate" IS NULL
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creditCard" ALTER COLUMN "cardHolderName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" ALTER COLUMN "cardExpirationDate" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD "quantityStock" integer NOT NULL`,
    );
  }
}
