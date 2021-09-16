import { MigrationInterface, QueryRunner } from 'typeorm';

export class release011620097535687 implements MigrationInterface {
  name = 'release011620097535687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fields" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "icon" character varying NOT NULL, CONSTRAINT "PK_ee7a215c6cd77a59e2cb3b59d41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "professionals_type" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "icon" character varying NOT NULL, CONSTRAINT "PK_7b5c3fea6f7311ab1fc64e95173" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contest_challenges" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "status" character varying NOT NULL DEFAULT 'open', "title" character varying NOT NULL, "context" character varying NOT NULL, "headline" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "goal" character varying NOT NULL, "deliverable" character varying NOT NULL, CONSTRAINT "PK_9854a94092af24ba8841a8d79a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contest_challenges_professionals_type" ("contestChallengesId" integer NOT NULL, "professionalsTypeId" integer NOT NULL, CONSTRAINT "PK_eeef7fe3ac7e94be4ae17cbdd5c" PRIMARY KEY ("contestChallengesId", "professionalsTypeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96d5389985c8e52a2de2d649f1" ON "contest_challenges_professionals_type" ("contestChallengesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba99dabb3213f30c94f3ca997a" ON "contest_challenges_professionals_type" ("professionalsTypeId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "contest_challenges_fields" ("contestChallengesId" integer NOT NULL, "fieldsId" integer NOT NULL, CONSTRAINT "PK_7b8423de2a7cabaebea02c6a5d9" PRIMARY KEY ("contestChallengesId", "fieldsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c06fb4683d7fd6d1fd9efe4311" ON "contest_challenges_fields" ("contestChallengesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89cbe1015f248bca9dda56422b" ON "contest_challenges_fields" ("fieldsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f" FOREIGN KEY ("contestChallengesId") REFERENCES "contest_challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae" FOREIGN KEY ("professionalsTypeId") REFERENCES "professionals_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_fields" ADD CONSTRAINT "FK_c06fb4683d7fd6d1fd9efe43111" FOREIGN KEY ("contestChallengesId") REFERENCES "contest_challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_fields" ADD CONSTRAINT "FK_89cbe1015f248bca9dda56422b7" FOREIGN KEY ("fieldsId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_fields" DROP CONSTRAINT "FK_89cbe1015f248bca9dda56422b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_fields" DROP CONSTRAINT "FK_c06fb4683d7fd6d1fd9efe43111"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_89cbe1015f248bca9dda56422b"`);
    await queryRunner.query(`DROP INDEX "IDX_c06fb4683d7fd6d1fd9efe4311"`);
    await queryRunner.query(`DROP TABLE "contest_challenges_fields"`);
    await queryRunner.query(`DROP INDEX "IDX_ba99dabb3213f30c94f3ca997a"`);
    await queryRunner.query(`DROP INDEX "IDX_96d5389985c8e52a2de2d649f1"`);
    await queryRunner.query(
      `DROP TABLE "contest_challenges_professionals_type"`,
    );
    await queryRunner.query(`DROP TABLE "contest_challenges"`);
    await queryRunner.query(`DROP TABLE "professionals_type"`);
    await queryRunner.query(`DROP TABLE "fields"`);
  }
}
