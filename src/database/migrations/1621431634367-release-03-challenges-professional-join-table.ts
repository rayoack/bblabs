import { MigrationInterface, QueryRunner } from 'typeorm';

export class release03ChallengesProfessionalJoinTable1621431634367
  implements MigrationInterface
{
  name = 'release03ChallengesProfessionalJoinTable1621431634367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_96d5389985c8e52a2de2d649f1"`);
    await queryRunner.query(`DROP INDEX "IDX_ba99dabb3213f30c94f3ca997a"`);
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_eeef7fe3ac7e94be4ae17cbdd5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_a1e135ac55fc617f23957fc3c46" PRIMARY KEY ("contestChallengesId", "professionalsTypeId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD "amount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_a1e135ac55fc617f23957fc3c46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_592d2ebafd8cbd1cf0c70abcb6e" PRIMARY KEY ("professionalsTypeId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_592d2ebafd8cbd1cf0c70abcb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_387e7e3392ce612cabf9f13f764" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f" FOREIGN KEY ("contestChallengesId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae" FOREIGN KEY ("professionalsTypeId") REFERENCES "professionals_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_387e7e3392ce612cabf9f13f764"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_592d2ebafd8cbd1cf0c70abcb6e" PRIMARY KEY ("professionalsTypeId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_592d2ebafd8cbd1cf0c70abcb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_a1e135ac55fc617f23957fc3c46" PRIMARY KEY ("contestChallengesId", "professionalsTypeId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP CONSTRAINT "PK_a1e135ac55fc617f23957fc3c46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "PK_eeef7fe3ac7e94be4ae17cbdd5c" PRIMARY KEY ("contestChallengesId", "professionalsTypeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ba99dabb3213f30c94f3ca997a" ON "contest_challenges_professionals_type" ("professionalsTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96d5389985c8e52a2de2d649f1" ON "contest_challenges_professionals_type" ("contestChallengesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_ba99dabb3213f30c94f3ca997ae" FOREIGN KEY ("professionalsTypeId") REFERENCES "professionals_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contest_challenges_professionals_type" ADD CONSTRAINT "FK_96d5389985c8e52a2de2d649f1f" FOREIGN KEY ("contestChallengesId") REFERENCES "contest_challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
