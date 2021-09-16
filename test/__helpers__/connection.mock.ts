const connection = (data?: any, squad?: any): any => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    insert: jest.fn(),
    where: jest.fn().mockReturnValue({
      orderBy: jest.fn().mockReturnValue({
        getMany: jest.fn().mockReturnValue({}),
      }),
    }),
  }),
  getRepository: jest.fn().mockReturnValue({
    findOne: squad
      ? jest.fn().mockReturnValue({
          ...squad,
        })
      : jest.fn(),
    findSquadByUser: squad
      ? jest.fn().mockReturnValue({
          ...squad,
        })
      : jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          getOne: jest.fn(),
        }),
      }),
      innerJoinAndSelect: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            getMany: jest.fn(),
          }),
        }),
      }),
    }),
  }),
  createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      delete: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn().mockResolvedValue(data),
      increment: jest.fn(),
      decrement: jest.fn(),
      createQueryBuilder: jest.fn(),
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              getMany: jest.fn(),
            }),
          }),
          where: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnValue({
                  leftJoin: jest.fn().mockReturnValue({
                    leftJoin: jest.fn().mockReturnValue({
                      leftJoin: jest.fn().mockReturnValue({
                        getMany: jest.fn(),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    },
  }),
});

export { connection };
