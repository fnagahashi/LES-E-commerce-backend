import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1764617421118 implements MigrationInterface {
    name = 'AutoMigration1764617421118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sale_tipo_enum" AS ENUM('percentual', 'valor_fixo', 'diaria_gratis')`);
        await queryRunner.query(`CREATE TABLE "sale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "codigoSale" character varying NOT NULL, "description" character varying NOT NULL, "deletedAt" TIMESTAMP, "tipo" "public"."sale_tipo_enum" NOT NULL DEFAULT 'percentual', "valor" numeric(10,2) NOT NULL, "validoAte" TIMESTAMP NOT NULL, "acumulativa" boolean NOT NULL DEFAULT false, "ativa" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "cep" character varying NOT NULL, "street" character varying NOT NULL, "neighborhood" character varying NOT NULL, "number" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "obs" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "guestId" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "dateBirth" character varying NOT NULL, "cpf" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "deletedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_eff400d57cd43170fc7c95db9c5" UNIQUE ("cpf"), CONSTRAINT "UQ_06f7a4d24efa523651c38fa35e9" UNIQUE ("email"), CONSTRAINT "PK_57689d19445de01737dbc458857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."room_type_enum" AS ENUM('single', 'double', 'suite')`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "roomCode" character varying(5) NOT NULL, "type" "public"."room_type_enum" NOT NULL, "qntdAdultos" integer NOT NULL, "qntdCriancas" integer NOT NULL, "precoBase" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ed1cf5b851e5b2893251111fd79" UNIQUE ("roomCode"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "codeReservation" character varying NOT NULL, "dateStart" date NOT NULL, "dateEnd" date NOT NULL, "noShow" boolean NOT NULL, "qntAdults" integer NOT NULL, "qntChildren" integer NOT NULL, "childrenAges" text, "priceTotal" numeric(10,2) NOT NULL, "paymentStatus" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "guestId" uuid, "roomId" uuid, CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "policy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "description" character varying NOT NULL, "percentual" integer NOT NULL, "deletedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9917b0c5e4286703cc656b1d39f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_type_enum" AS ENUM('credit_card', 'debit_card', 'pix')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "type" "public"."payment_type_enum" NOT NULL, "price" integer NOT NULL, "paymentDate" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "deletedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT false, "dataEHora" TIMESTAMP NOT NULL DEFAULT now(), "mensagem" text NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6c0b82a0fbd5655bb86d3eb0009" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3" FOREIGN KEY ("guestId") REFERENCES "guest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_ee6959f2cbe32d030b5e58b45d7"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_005fbe8bc326fced13b5751aeb3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6c0b82a0fbd5655bb86d3eb0009"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_type_enum"`);
        await queryRunner.query(`DROP TABLE "policy"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TYPE "public"."room_type_enum"`);
        await queryRunner.query(`DROP TABLE "guest"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`DROP TYPE "public"."sale_tipo_enum"`);
    }

}
