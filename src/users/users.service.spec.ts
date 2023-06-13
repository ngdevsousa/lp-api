import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get_mocked_query_builder } from '../../test/helpers/typeorm.helper';
import { UserStatus } from '../common/types';
import { User } from '../database/entities';
import { UsersService } from './users.service';

describe('RecordsService', () => {
    let service: UsersService;
    let user_repository = get_mocked_query_builder()

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService, {
                provide: getRepositoryToken(User),
                useValue: user_repository
            }],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const mocked_user: Partial<User> = {
                username: 'test',
                password: 'test',
            };
            jest
                .spyOn(service, 'find_by_name')
                .mockResolvedValueOnce(null);
            jest
                .spyOn(user_repository, 'save')
                .mockResolvedValueOnce(mocked_user as User);

            const result = await service.create(mocked_user);

            expect(result.access_token).not.toBeUndefined();
            expect(result.expires_in).not.toBeUndefined();
        });

        it('should not create a user if username already exists', async () => {
            const mocked_user: Partial<User> = {
                username: 'test',
                password: 'test',
            };

            jest
                .spyOn(service, 'find_by_name')
                .mockResolvedValueOnce(mocked_user as User);

            await expect(service.create(mocked_user))
                .rejects
                .toThrow('Username already in use');
        });
    });

    describe('find_by_name', () => {
        it('should find a user by name', async () => {
            const mocked_user: User = {
                id: 1,
                username: 'test',
                password: 'test',
                status: UserStatus.ACTIVE,
                balance: 100,
            };
            jest
                .spyOn(user_repository, 'findOneBy')
                .mockResolvedValueOnce(mocked_user);

            const result = await service.find_by_name('test');
            expect(result).toEqual(mocked_user);
            expect(user_repository.findOneBy).toBeCalledWith({ username: 'test' })
        });
    });

    describe('find_by_id', () => {
        it('should find a user by id', async () => {
            const mocked_user: User = {
                id: 1,
                username: 'test',
                password: 'test',
                status: UserStatus.ACTIVE,
                balance: 100,
            };
            jest
                .spyOn(user_repository, 'findOne')
                .mockResolvedValueOnce(mocked_user);

            const result = await service.find_by_id(1);
            expect(result).toEqual(mocked_user);
            expect(user_repository.findOne).toBeCalledWith({
                select: ['id', 'username', 'status', 'balance'],
                where: { id: 1 }
            })
        });
    });

    describe('update_balance', () => {
        it('should update a user balance', async () => {
            const user_id = 1;
            const new_balance = 200;

            await service.update_balance(user_id, new_balance);
            expect(user_repository.set)
                .toHaveBeenCalledWith({ balance: 200 });
            expect(user_repository.andWhere)
                .toHaveBeenCalledWith('users.id = :user_id', { user_id: 1 });
            expect(user_repository.execute).toBeCalledTimes(1);
        });
    });
});
