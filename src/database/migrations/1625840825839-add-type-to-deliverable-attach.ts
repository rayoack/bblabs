import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTypeToDeliverableAttach1625840825839
  implements MigrationInterface
{
  name = 'addTypeToDeliverableAttach1625840825839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "squad_deliverables_stage_enum" RENAME TO "squad_deliverables_stage_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "squad_deliverables_stage_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ALTER COLUMN "stage" TYPE "squad_deliverables_stage_enum" USING "stage"::"text"::"squad_deliverables_stage_enum"`,
    );
    await queryRunner.query(`DROP TYPE "squad_deliverables_stage_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ba99dabb3213f30c94f3ca997a"`);
    await queryRunner.query(`DROP INDEX "IDX_96d5389985c8e52a2de2d649f1"`);
    await queryRunner.query(
      `CREATE TYPE "squad_deliverables_stage_enum_old" AS ENUM('discovery', 'ui', 'development')`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ALTER COLUMN "stage" TYPE "squad_deliverables_stage_enum_old" USING "stage"::"text"::"squad_deliverables_stage_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "squad_deliverables_stage_enum"`);
    await queryRunner.query(
      `ALTER TYPE "squad_deliverables_stage_enum_old" RENAME TO "squad_deliverables_stage_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" DROP COLUMN "type"`,
    );
  }
}
