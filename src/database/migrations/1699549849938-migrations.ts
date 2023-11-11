import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699549849938 implements MigrationInterface {
  name = 'Migrations1699549849938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_accounttype_enum" AS ENUM('base', 'premium')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "accountType" "public"."user_accounttype_enum" DEFAULT 'base'`,
    );
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "brand"`);
    await queryRunner.query(`DROP TYPE "public"."announcement_brand_enum"`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "brand" text`);
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP COLUMN "currency"`,
    );
    await queryRunner.query(`DROP TYPE "public"."announcement_currency_enum"`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "currency" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."announcement_currency_enum" AS ENUM('usd', 'eur', 'uah')`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "currency" "public"."announcement_currency_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "brand"`);
    await queryRunner.query(
      `CREATE TYPE "public"."announcement_brand_enum" AS ENUM('volkswagen', 'bmw', 'renault', 'audi', 'volvo', 'chevrolet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "brand" "public"."announcement_brand_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountType"`);
    await queryRunner.query(`DROP TYPE "public"."user_accounttype_enum"`);
  }
}
