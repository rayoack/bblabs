import { MigrationInterface, QueryRunner } from 'typeorm';

export class release03Vacancies1622019770183 implements MigrationInterface {
  name = 'release03Vacancies1622019770183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vacancies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "amount" integer NOT NULL DEFAULT '0', "squadId" integer, "professionalTypeId" integer, CONSTRAINT "PK_3b45154a366568190cc15be2906" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625" FOREIGN KEY ("squadId") REFERENCES "squad"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" ADD CONSTRAINT "FK_69e15ad0c65b6ef2945b697af0c" FOREIGN KEY ("professionalTypeId") REFERENCES "professionals_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vacancies" DROP CONSTRAINT "FK_69e15ad0c65b6ef2945b697af0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vacancies" DROP CONSTRAINT "FK_2cd48ba4dab670fd2d7a0bb7625"`,
    );
    await queryRunner.query(`DROP TABLE "vacancies"`);
  }
}
