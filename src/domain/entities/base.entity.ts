import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  public created_at?: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  public updated_at?: Date;
}
