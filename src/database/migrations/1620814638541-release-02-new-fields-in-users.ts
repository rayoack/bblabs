import { MigrationInterface, QueryRunner } from 'typeorm';

export class release02NewFieldsInUsers1620814638541
  implements MigrationInterface
{
  name = 'release02NewFieldsInUsers1620814638541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_fields" ("usersId" integer NOT NULL, "fieldsId" integer NOT NULL, CONSTRAINT "PK_b870d1e7fafc0d4302e632b4b71" PRIMARY KEY ("usersId", "fieldsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_694f753034c49758a41a0e2dc9" ON "users_fields" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_703e0b060ef987122cd2751d5f" ON "users_fields" ("fieldsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "goal_to_participate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "dedication_time" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_fields" ADD CONSTRAINT "FK_694f753034c49758a41a0e2dc9b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_fields" ADD CONSTRAINT "FK_703e0b060ef987122cd2751d5f0" FOREIGN KEY ("fieldsId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_fields" DROP CONSTRAINT "FK_703e0b060ef987122cd2751d5f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_fields" DROP CONSTRAINT "FK_694f753034c49758a41a0e2dc9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "dedication_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "goal_to_participate"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_703e0b060ef987122cd2751d5f"`);
    await queryRunner.query(`DROP INDEX "IDX_694f753034c49758a41a0e2dc9"`);
    await queryRunner.query(`DROP TABLE "users_fields"`);
  }
}
