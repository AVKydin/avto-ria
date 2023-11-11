import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699427755951 implements MigrationInterface {
  name = 'Migrations1699427755951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."role_role_enum" AS ENUM('Buyer', 'Seller', 'Manager', 'Admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."role_role_enum" NOT NULL, "userId" uuid, CONSTRAINT "REL_3e02d32dd4707c91433de0390e" UNIQUE ("userId"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "avatar" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_producer_enum" AS ENUM('audi', 'bmw', 'opel')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."car_currency_enum" AS ENUM('usd', 'eur', 'uah')`,
    );
    await queryRunner.query(
      `CREATE TABLE "car" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "price" integer NOT NULL, "model" text NOT NULL, "producer" "public"."car_producer_enum" NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "currency" "public"."car_currency_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_3e02d32dd4707c91433de0390ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD CONSTRAINT "FK_a4f3cb1b950608959ba75e8df36" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car" DROP CONSTRAINT "FK_a4f3cb1b950608959ba75e8df36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_3e02d32dd4707c91433de0390ea"`,
    );
    await queryRunner.query(`DROP TABLE "car"`);
    await queryRunner.query(`DROP TYPE "public"."car_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."car_producer_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_role_enum"`);
  }
}
