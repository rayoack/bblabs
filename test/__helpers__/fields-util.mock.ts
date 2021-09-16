import { FieldsRepository } from '../../src/domain/fields/fields.repository';

export const fieldsRepository: FieldsRepository = new FieldsRepository();

export const fieldsServiceMock: any = {
  fieldsRepository,
  findAll: jest.fn(),
};

export const fieldsListMock = [
  {
    id: 1,
    createdAt: '2021-05-07T13:20:03.363Z',
    updatedAt: '2021-05-07T13:20:03.363Z',
    name: 'Blockchain',
    icon: 'Blockchain.svg',
  },
  {
    id: 2,
    createdAt: '2021-05-07T13:20:03.363Z',
    updatedAt: '2021-05-07T13:20:03.363Z',
    name: 'AI',
    icon: 'AI.svg',
  },
];
