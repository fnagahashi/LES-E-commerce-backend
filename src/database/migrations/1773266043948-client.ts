import { MigrationInterface, QueryRunner } from "typeorm";

export class Client1773266043948 implements MigrationInterface {
    name = 'Client1773266043948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dataEHora" TIMESTAMP NOT NULL DEFAULT now(), "mensagem" text NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "typeResidence" character varying NOT NULL, "typeStreet" character varying NOT NULL, "cep" character varying NOT NULL, "street" character varying NOT NULL, "neighborhood" character varying NOT NULL, "number" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "obs" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "dateBirth" character varying NOT NULL, "cpf" character varying NOT NULL, "gender" character varying NOT NULL, "phoneDDD" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "phoneType" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "confirmPassword" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9921dca81551c93e5a459ef03ce" UNIQUE ("cpf"), CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email"), CONSTRAINT "UQ_ef3b71194d7352201ed09af7df8" UNIQUE ("password"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "creditCard" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cardNumber" character varying NOT NULL, "cardName" character varying NOT NULL, "cardFlag" character varying NOT NULL, "securityCode" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "clientId" uuid, CONSTRAINT "PK_b2847f559fa03ee6e9e0fd72085" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_3d3e29e99d821fd75d7cb117e04" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "creditCard" ADD CONSTRAINT "FK_70af263ee0ddc26b61ecdb0452b" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creditCard" DROP CONSTRAINT "FK_70af263ee0ddc26b61ecdb0452b"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_3d3e29e99d821fd75d7cb117e04"`);
        await queryRunner.query(`DROP TABLE "creditCard"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
