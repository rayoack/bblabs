import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attachments {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  extension: string;
}
