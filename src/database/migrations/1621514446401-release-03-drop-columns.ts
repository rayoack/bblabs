import { MigrationInterface, QueryRunner } from 'typeorm';

export class release03DropColumns1621514446401 implements MigrationInterface {
  name = 'release03DropColumns1621514446401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "squad" DROP COLUMN "open_positions"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squad" ADD "open_positions" integer NOT NULL`,
    );
  }
}
