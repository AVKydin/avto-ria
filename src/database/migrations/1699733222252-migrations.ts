import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1699733222252 implements MigrationInterface {
  name = 'Migrations1699733222252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "viewedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "viewsCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP COLUMN "viewsCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP COLUMN "viewedAt"`,
    );
  }
}
