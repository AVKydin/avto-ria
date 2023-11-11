import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699433877477 implements MigrationInterface {
  name = 'Migrations1699433877477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."announcement_brand_enum" AS ENUM('volkswagen', 'bmw', 'renault', 'audi', 'volvo', 'chevrolet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "brand" "public"."announcement_brand_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "model"`);
    await queryRunner.query(
      `CREATE TYPE "public"."announcement_model_enum" AS ENUM('s1', 'q4', 'x1', 'x5', 'z4', 'aveo', 'cruze', 'captiva', 'duster', 'koleos', 'golf', 'tiguan', 'xc40', 'v60')`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "model" "public"."announcement_model_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "model"`);
    await queryRunner.query(`DROP TYPE "public"."announcement_model_enum"`);
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "model" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "brand"`);
    await queryRunner.query(`DROP TYPE "public"."announcement_brand_enum"`);
  }
}
