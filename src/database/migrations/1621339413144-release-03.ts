import { MigrationInterface, QueryRunner } from 'typeorm';

export class release031621339413144 implements MigrationInterface {
  name = 'release031621339413144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "squad" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "number" SERIAL NOT NULL, "name" character varying(25) NOT NULL, "description" character varying(155) NOT NULL, "open_positions" integer NOT NULL, "creator" integer, "contestChallengeId" integer, CONSTRAINT "REL_765426dd38efb8711785ef4f22" UNIQUE ("creator"), CONSTRAINT "PK_90e924b0dbb125f974606646bce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "squad_to_user" ("squadToUser" SERIAL NOT NULL, "squadId" integer NOT NULL, "userId" integer NOT NULL, "included_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "professionalTypeId" integer, CONSTRAINT "PK_ef78db282a0ea5e3b4001045468" PRIMARY KEY ("squadToUser"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "FK_765426dd38efb8711785ef4f22b" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "FK_5723c937c217c75b4c2e85c946b" FOREIGN KEY ("contestChallengeId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD CONSTRAINT "FK_e1b7482687d19438629a7f20901" FOREIGN KEY ("professionalTypeId") REFERENCES "professionals_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD CONSTRAINT "FK_d843b65b5aca4461bb4b9bcb0ec" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD CONSTRAINT "FK_20edd7161a367301fc121273d3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP CONSTRAINT "FK_20edd7161a367301fc121273d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP CONSTRAINT "FK_d843b65b5aca4461bb4b9bcb0ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP CONSTRAINT "FK_e1b7482687d19438629a7f20901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" DROP CONSTRAINT "FK_5723c937c217c75b4c2e85c946b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" DROP CONSTRAINT "FK_765426dd38efb8711785ef4f22b"`,
    );
    await queryRunner.query(`DROP TABLE "squad_to_user"`);
    await queryRunner.query(`DROP TABLE "squad"`);
  }
}
