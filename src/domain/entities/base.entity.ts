import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  public createdAt?: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  public updatedAt?: Date;
}
