import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699432095223 implements MigrationInterface {
  name = 'Migrations1699432095223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."announcement_currency_enum" AS ENUM('usd', 'eur', 'uah')`,
    );
    await queryRunner.query(
      `CREATE TABLE "announcement" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "year" integer NOT NULL, "price" integer NOT NULL, "model" text NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "currency" "public"."announcement_currency_enum" NOT NULL, "userId" uuid, CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "city" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
    await queryRunner.query(`DROP TABLE "announcement"`);
    await queryRunner.query(`DROP TYPE "public"."announcement_currency_enum"`);
  }
}
