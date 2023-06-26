export const get_mocked_query_builder = () => {
    return {
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        transaction: jest.fn()
    };
}