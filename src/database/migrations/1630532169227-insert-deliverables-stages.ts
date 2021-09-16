import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertDeliverablesStages1630532169227
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into public.deliverables_stages(name, description, expected_results, url_guide, icon_name) values ('Exploração', 'Defina o problema de usuário e negócio que se pretende resolver.', 'O resultado esperado dessa fase é a definição de problema da pessoa usuária e de negócio que se pretende resolver.', 'https://bossabox-labs-prod.s3.sa-east-1.amazonaws.com/guia+de+entrega/Guia-Explorac%CC%A7a%CC%83o.pdf', 'exploration.svg')`,
    );
    await queryRunner.query(
      `insert into public.deliverables_stages(name, description, expected_results, url_guide, icon_name) values ('Solução', 'Gere um protótipo priorizado e com viabilidade técnica.', 'O resultado esperado dessa fase é um protótipo priorizado e com viabilidade técnica confirmada.', 'https://bossabox-labs-prod.s3.sa-east-1.amazonaws.com/guia+de+entrega/Guia-Soluc%CC%A7a%CC%83o.pdf', 'solution.svg')`,
    );
    await queryRunner.query(
      `insert into public.deliverables_stages(name, description, expected_results, url_guide, icon_name) values ('Desenvolvimento', 'Programe, realize testes e entregue uma solução funcional.', 'O resultado esperado dessa fase é a solução programada, testada e funcionando.', 'https://bossabox-labs-prod.s3.sa-east-1.amazonaws.com/guia+de+entrega/Guia-Desenvolvimento.pdf', 'development.svg')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from public.deliverables_stages`);
  }
}
