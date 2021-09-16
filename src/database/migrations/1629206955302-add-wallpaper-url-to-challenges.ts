import { MigrationInterface, QueryRunner } from 'typeorm';

export class addWallpaperUrlToChallenges1629206955302
  implements MigrationInterface
{
  name = 'addWallpaperUrlToChallenges1629206955302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges" ADD "wallpaperUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contest_challenges" DROP COLUMN "wallpaperUrl"`,
    );
  }
}
