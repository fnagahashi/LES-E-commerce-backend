import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1775348485874 implements MigrationInterface {
  name = "AutoMigration1775348485874";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."unique_cpf_not_deleted"`);
    await queryRunner.query(
      `CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, "category" character varying NOT NULL, "yearPublication" character varying NOT NULL, "isbn" character varying NOT NULL, "publisher" character varying NOT NULL, "quantityStock" integer NOT NULL, "price" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "bookId" uuid, CONSTRAINT "REL_1903b05e18dd2b31c45ca877f8" UNIQUE ("bookId"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cupom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cupomCode" character varying NOT NULL, "cupomValue" integer NOT NULL, "isActive" boolean NOT NULL, "cupomType" character varying NOT NULL, "used" boolean NOT NULL, "clientId" uuid, CONSTRAINT "PK_f4637ad7b7afd15f3934828c5ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orderItem" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unitaryValue" character varying NOT NULL, "totalItemValue" character varying NOT NULL, "orderId" uuid, "bookId" uuid, CONSTRAINT "PK_fe5c4758e5f47a681deb1065c92" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "freightType" character varying NOT NULL, "freightValue" character varying NOT NULL, "addressId" uuid, CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderDate" TIMESTAMP NOT NULL, "totalPrice" character varying NOT NULL, "freightValue" character varying NOT NULL, "status" character varying NOT NULL, "clientId" uuid, "deliveryId" uuid, CONSTRAINT "REL_ec67a0143b254c3577087b20d3" UNIQUE ("deliveryId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentMethod" character varying NOT NULL, "paymentValue" character varying NOT NULL, "paymentStatus" character varying NOT NULL, "orderId" uuid, "creditCardId" uuid, "cupomId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD "addressNickname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD "isDeliveryAddress" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD "isBillingAddress" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" ADD "cardHolderName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" ADD "isMainCard" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "creditCard" ADD "paymentId" uuid`);
    await queryRunner.query(`
  UPDATE "creditCard"
  SET "cardExpirationDate" = '01/01/2000'
  WHERE "cardExpirationDate" IS NULL
`);
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_1903b05e18dd2b31c45ca877f89" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" ADD CONSTRAINT "FK_40301d8f92f33547eda43c79805" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cupom" ADD CONSTRAINT "FK_b3cd26972553aa787354fc29651" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_ef8ed42ef2c6feafd1447d96279" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" ADD CONSTRAINT "FK_3f1b5117868a0bbf32c2554abb3" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_5eec4cd65e168c332d236241e5e" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_865afe6071e02b700a95ab8a1d5" FOREIGN KEY ("creditCardId") REFERENCES "creditCard"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_5b1bda05680ab3cffdda2afb0e1" FOREIGN KEY ("cupomId") REFERENCES "cupom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_5b1bda05680ab3cffdda2afb0e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_865afe6071e02b700a95ab8a1d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_9b27855a9c2ade186e5c55d1ec3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_5eec4cd65e168c332d236241e5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_3f1b5117868a0bbf32c2554abb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderItem" DROP CONSTRAINT "FK_ef8ed42ef2c6feafd1447d96279"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cupom" DROP CONSTRAINT "FK_b3cd26972553aa787354fc29651"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" DROP CONSTRAINT "FK_40301d8f92f33547eda43c79805"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_1903b05e18dd2b31c45ca877f89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" ALTER COLUMN "cardExpirationDate" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "creditCard" DROP COLUMN "paymentId"`);
    await queryRunner.query(
      `ALTER TABLE "creditCard" DROP COLUMN "isMainCard"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creditCard" DROP COLUMN "cardHolderName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP COLUMN "isBillingAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP COLUMN "isDeliveryAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP COLUMN "addressNickname"`,
    );
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "delivery"`);
    await queryRunner.query(`DROP TABLE "orderItem"`);
    await queryRunner.query(`DROP TABLE "cupom"`);
    await queryRunner.query(`DROP TABLE "stock"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_cpf_not_deleted" ON "client" ("cpf") WHERE ("deletedAt" IS NULL)`,
    );
  }
}
