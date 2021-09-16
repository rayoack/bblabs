import { MigrationInterface, QueryRunner } from 'typeorm';

export class challengesResults1627411636343 implements MigrationInterface {
  name = 'challengesResults1627411636343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "challenges_results" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "squadId" uuid NOT NULL, "contestChallengeId" integer NOT NULL, "trophyType" "votes_trophytype_enum" NOT NULL, "votes" integer NOT NULL, "position" integer NOT NULL, CONSTRAINT "PK_e54373b40ba3e49c504446bb837" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenges_results" ADD CONSTRAINT "FK_4acd5c813072427be7fc70a2e44" FOREIGN KEY ("contestChallengeId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenges_results" ADD CONSTRAINT "FK_a770dc7e34fa2943a64ff9dea6d" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "challenges_results" DROP CONSTRAINT "FK_a770dc7e34fa2943a64ff9dea6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challenges_results" DROP CONSTRAINT "FK_4acd5c813072427be7fc70a2e44"`,
    );
    await queryRunner.query(`DROP TABLE "challenges_results"`);
  }
}
