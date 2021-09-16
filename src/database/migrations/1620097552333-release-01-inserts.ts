import { MigrationInterface, QueryRunner } from 'typeorm';

export class release01Inserts1620097552333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into public.professionals_type(name, icon) values ('Designer de Produto', 'pd.svg')`,
    );
    await queryRunner.query(
      `insert into public.professionals_type(name, icon) values ('Gerente de Produto', 'pm.svg')`,
    );
    await queryRunner.query(
      `insert into public.professionals_type(name, icon) values ('Desenvolvedor(a)', 'dev.svg')`,
    );
    await queryRunner.query(
      `insert into public.professionals_type(name, icon) values ('QA', 'qa.svg')`,
    );
    await queryRunner.query(
      `insert into public.professionals_type(name, icon) values ('Tech Lead', 'tl.svg')`,
    );

    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Agronomia', 'agronomy.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('AI', 'ai.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Animais', 'animals.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Blockchain', 'blockchain.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Educação', 'education.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Empregabilidade', 'employability.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Alimentação', 'feeding.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Mercado Financeiro', 'financial-market.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Games', 'games.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Saúde', 'health.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Moradia', 'housing.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('RH', 'hr.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Direito', 'law.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Marketing', 'marketing.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Mobilidade', 'mobility.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Segurança', 'security.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Impacto Social', 'social-impact.svg')`,
    );
    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Turismo', 'turism.svg')`,
    );

    await queryRunner.query(
      `insert into public.fields(name, icon) values ('Sustentabilidade', 'sustainability.svg')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM PUBLIC.PROFESSIONALS_TYPE`);
    await queryRunner.query(`DELETE FROM PUBLIC.FIELDS`);
  }
}
