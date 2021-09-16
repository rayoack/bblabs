import { MigrationInterface, QueryRunner } from 'typeorm';

export class release12AddVotes1626345871024 implements MigrationInterface {
  name = 'release12AddVotes1626345871024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "votes_trophytype_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "votes" ("id" SERIAL NOT NULL, "included_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "trophyType" "votes_trophytype_enum" NOT NULL, "contestChallengeId" integer, "squadId" uuid, "userId" integer, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_e5561d5f4d24dfcec0da83c1844" FOREIGN KEY ("contestChallengeId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_30c8eb3fae4a958369a16411002" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_5169384e31d0989699a318f3ca4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_5169384e31d0989699a318f3ca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_30c8eb3fae4a958369a16411002"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_e5561d5f4d24dfcec0da83c1844"`,
    );
    await queryRunner.query(`DROP TABLE "votes"`);
    await queryRunner.query(`DROP TYPE "votes_trophytype_enum"`);
  }
}
