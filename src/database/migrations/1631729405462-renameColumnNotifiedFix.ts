import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameColumnNotifiedFix1631729405462
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "notified" TO "is_member_of_labs_community"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "is_member_of_labs_community" TO "notified"`,
    );
  }
}
