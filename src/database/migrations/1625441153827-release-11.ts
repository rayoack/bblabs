import { MigrationInterface, QueryRunner } from 'typeorm';

export class release111625441153827 implements MigrationInterface {
  name = 'release111625441153827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "squad_deliverables_stage_enum" AS ENUM('discovery', 'ui', 'development')`,
    );
    await queryRunner.query(
      `CREATE TABLE "squad_deliverables" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "stage" "squad_deliverables_stage_enum" NOT NULL, "squadId" uuid, CONSTRAINT "PK_f35f6fd67745ac3dc5df2d9171c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "squad_deliverables_attachments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "url" character varying NOT NULL, "squadDeliverablesId" integer, "creatorId" integer, CONSTRAINT "PK_3b6082fcf2093d891de419e6ea6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" DROP CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625"`,
    );
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "squadId"`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD "squadId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP CONSTRAINT "FK_d843b65b5aca4461bb4b9bcb0ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" DROP CONSTRAINT "FK_5723c937c217c75b4c2e85c946b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" DROP CONSTRAINT "PK_90e924b0dbb125f974606646bce"`,
    );
    await queryRunner.query(`ALTER TABLE "squad" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "squad" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "PK_90e924b0dbb125f974606646bce" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ALTER COLUMN "contestChallengeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP CONSTRAINT "FK_20edd7161a367301fc121273d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP COLUMN "squadId"`,
    );
    await queryRunner.query(`ALTER TABLE "squad_to_user" ADD "squadId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" ADD CONSTRAINT "FK_65bd0af0b74b3a025026df7c5a4" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" ADD CONSTRAINT "FK_2efce7cf64d8420fc2465b4437c" FOREIGN KEY ("squadDeliverablesId") REFERENCES "squad_deliverables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" ADD CONSTRAINT "FK_0d46c8045f82cdf25234e4375a8" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "FK_5723c937c217c75b4c2e85c946b" FOREIGN KEY ("contestChallengeId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "squad" DROP CONSTRAINT "FK_5723c937c217c75b4c2e85c946b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" DROP CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" DROP CONSTRAINT "FK_0d46c8045f82cdf25234e4375a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables_attachments" DROP CONSTRAINT "FK_2efce7cf64d8420fc2465b4437c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_deliverables" DROP CONSTRAINT "FK_65bd0af0b74b3a025026df7c5a4"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_ba99dabb3213f30c94f3ca997a"`);
    await queryRunner.query(`DROP INDEX "IDX_96d5389985c8e52a2de2d649f1"`);
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" DROP COLUMN "squadId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD "squadId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD CONSTRAINT "FK_20edd7161a367301fc121273d3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ALTER COLUMN "contestChallengeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" DROP CONSTRAINT "PK_90e924b0dbb125f974606646bce"`,
    );
    await queryRunner.query(`ALTER TABLE "squad" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "squad" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "PK_90e924b0dbb125f974606646bce" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad" ADD CONSTRAINT "FK_5723c937c217c75b4c2e85c946b" FOREIGN KEY ("contestChallengeId") REFERENCES "contest_challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "squad_to_user" ADD CONSTRAINT "FK_d843b65b5aca4461bb4b9bcb0ec" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "vacancies" DROP COLUMN "squadId"`);
    await queryRunner.query(`ALTER TABLE "vacancies" ADD "squadId" integer`);
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "squad_deliverables_attachments"`);
    await queryRunner.query(`DROP TABLE "squad_deliverables"`);
    await queryRunner.query(`DROP TYPE "squad_deliverables_stage_enum"`);
  }
}
