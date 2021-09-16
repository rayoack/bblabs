import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDeliverablesStages1630500649354 implements MigrationInterface {
  name = 'addDeliverablesStages1630500649354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `delete from public.squad_deliverables_attachments`,
    );
    await queryRunner.query(`delete from public.squad_deliverables`);
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" RENAME COLUMN "stage" TO "stageId"`,
    );
    await queryRunner.query(
      `CREATE TABLE "deliverables_stages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "expected_results" character varying NOT NULL, "url_guide" character varying NOT NULL, "icon_name" character varying NOT NULL, CONSTRAINT "PK_01d36c6bb2fefbb75788b1cfc6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contest_challenges_deliverables_stages" ("contestChallengesId" integer NOT NULL, "deliverablesStagesId" integer NOT NULL, CONSTRAINT "PK_e3076cc88f6468fd7de6e5af4e9" PRIMARY KEY ("contestChallengesId", "deliverablesStagesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4be866e3a215e1159fdf784de" ON "contest_challenges_deliverables_stages" ("contestChallengesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e98cb150b3a65bdc1ed2cffb99" ON "contest_challenges_deliverables_stages" ("deliverablesStagesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" DROP COLUMN "stageId"`,
    );
    await queryRunner.query(`DROP TYPE "squad_deliverables_stage_enum"`);
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ADD "stageId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ADD CONSTRAINT "FK_f8720f3fabdb0ff4e309b5574fb" FOREIGN KEY ("stageId") REFERENCES "deliverables_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_deliverables_stages" ADD CONSTRAINT "FK_f4be866e3a215e1159fdf784de0" FOREIGN KEY ("contestChallengesId") REFERENCES "contest_challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_deliverables_stages" ADD CONSTRAINT "FK_e98cb150b3a65bdc1ed2cffb991" FOREIGN KEY ("deliverablesStagesId") REFERENCES "deliverables_stages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_deliverables_stages" DROP CONSTRAINT "FK_e98cb150b3a65bdc1ed2cffb991"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_deliverables_stages" DROP CONSTRAINT "FK_f4be866e3a215e1159fdf784de0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" DROP CONSTRAINT "FK_f8720f3fabdb0ff4e309b5574fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" DROP COLUMN "stageId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_e98cb150b3a65bdc1ed2cffb99"`);
    await queryRunner.query(`DROP INDEX "IDX_f4be866e3a215e1159fdf784de"`);
    await queryRunner.query(
      `DROP TABLE "contest_challenges_deliverables_stages"`,
    );
    await queryRunner.query(`DROP TABLE "deliverables_stages"`);
    await queryRunner.query(
      `CREATE TYPE "squad_deliverables_stage_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ADD "stageId" "squad_deliverables_stage_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" RENAME COLUMN "stageId" TO "stage"`,
    );
  }
}
