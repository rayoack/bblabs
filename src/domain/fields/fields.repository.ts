import { Repository, EntityRepository } from 'typeorm';
import { Fields } from '../entities';

@EntityRepository(Fields)
export class FieldsRepository extends Repository<Fields> {}
