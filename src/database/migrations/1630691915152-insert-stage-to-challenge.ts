import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertStageToChallenge1630691915152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.contest_challenges_deliverables_stages(
                "contestChallengesId", "deliverablesStagesId")
                VALUES (1, 1);`,
    );

    await queryRunner.query(
      `INSERT INTO public.contest_challenges_deliverables_stages(
                "contestChallengesId", "deliverablesStagesId")
                VALUES (1, 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.contest_challenges_deliverables_stages(
                "contestChallengesId", "deliverablesStagesId")
                VALUES (1, 3);`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
