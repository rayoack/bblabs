import { MigrationInterface, QueryRunner } from 'typeorm';

export class release03NewCollumnsSlugNameAvatarInUser1622045342919
  implements MigrationInterface
{
  name = 'release03NewCollumnsSlugNameAvatarInUser1622045342919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "slug" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "avatar" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "slug"`);
  }
}
