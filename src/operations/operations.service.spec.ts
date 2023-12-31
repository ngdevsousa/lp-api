import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get_mocked_query_builder } from '../../test/helpers/typeorm.helper';
import { OperationType } from '../common/types';
import { Operation, Record, User } from '../database/entities';
import { RecordsService } from '../records/records.service';
import { UsersService } from '../users/users.service';
import { OperationsService } from './operations.service';

function getMocks(...repos) {
  return repos.map(repoToMock => ({
    provide: getRepositoryToken(repoToMock),
    useValue: get_mocked_query_builder()
  }))
}

describe('OperationsService', () => {
  let service: OperationsService;
  let users_service: UsersService;
  let records_service: RecordsService;
  let operations_repository = get_mocked_query_builder();
  let trx_manager = get_mocked_query_builder();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsService,
        RecordsService,
        UsersService,
        {
          provide: getRepositoryToken(Operation),
          useValue: { ...operations_repository, manager: trx_manager }
        },
        ...getMocks(User, Record)],
    }).compile();

    service = module.get<OperationsService>(OperationsService);
    users_service = module.get<UsersService>(UsersService);
    records_service = module.get<RecordsService>(RecordsService);
  });

  beforeEach(() => {
    trx_manager.transaction.mockImplementation(callback => callback(trx_manager));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if user has insufficient balance', async () => {
      jest
        .spyOn(users_service, 'find_by_id')
        .mockImplementationOnce(async () => ({ balance: 0 } as User));

      await expect(service.create({ type: OperationType.ADD, x: 1, y: 2 }, { id: 1 }))
        .rejects
        .toThrow('Insufficient balance. Please ensure your account has sufficient funds and try again');
    });

    it('should return a record if operation is successful', async () => {
      jest
        .spyOn(users_service, 'find_by_id')
        .mockImplementationOnce(async () => ({ balance: 10 } as User));
      jest
        .spyOn(users_service, 'update_balance')
        .mockImplementationOnce(async () => undefined);
      trx_manager
        .save
        .mockResolvedValue(new Operation());
      jest
        .spyOn(records_service, 'create')
        .mockImplementationOnce(async () => ({ id: 1, user_balance: 9 } as Record));
      const operation_to_create = { type: OperationType.ADD, x: 1, y: 2 };
      const result = await service.create(operation_to_create, { id: 1 });

      expect(result).toEqual({ id: 1, user_balance: 9 });
      expect(users_service.find_by_id).toBeCalledTimes(1);
      expect(users_service.update_balance).toBeCalledTimes(1);
      expect(records_service.create).toBeCalledTimes(1);
      expect(trx_manager.save).toBeCalledTimes(1);
    });

    it('should throw an error if operation is invalid', async () => {
      jest
        .spyOn(users_service, 'find_by_id').mockResolvedValue({ balance: 10 });
      const operation_to_create = { type: OperationType.DIV, x: 1, y: 0 };

      await expect(service.create(operation_to_create, { id: 1 }))
        .rejects
        .toThrow('Operation Not Allowed');
    });
  });

  describe('prepare_for_insert', () => {
    it('should prepare an operation for insertion', async () => {
      jest
        .spyOn(users_service, 'find_by_id')
        .mockResolvedValue({ balance: 100 });
      const user_id = 1;
      const expected_balance = 92;
      const { operation_to_insert, new_balance } = await service.prepare_for_insert(OperationType.RANDOM, user_id);

      expect(operation_to_insert.type).toEqual('random_string');
      expect(operation_to_insert.cost).toEqual(8);
      expect(new_balance).toEqual(expected_balance);
    });
  });

  describe('process_operation', () => {
    it('should handle a valid operation', async () => {
      const operation = { type: OperationType.ADD, x: 1, y: 2 };
      const result = await service.process_operation(operation);

      expect(result).toEqual(3);
    });

    it('should throw an error for an invalid operation', async () => {
      const operation = { type: OperationType.DIV, x: 1, y: 0 };

      await expect(service.process_operation(operation))
        .rejects
        .toThrow('Operation Not Allowed');
    });

    it('should throw an error for unsupported operation', async () => {
      const operation = { type: 'foo', x: 1, y: 0 };

      await expect(service.process_operation(operation as any))
        .rejects
        .toThrow('Operation Not Supported');
    });
  });

  describe('verify_balance', () => {
    it('should verify if the user has enough balance for the operation', async () => {
      jest
        .spyOn(users_service, 'find_by_id')
        .mockResolvedValue({ balance: 100 });

      const result = await service.verify_balance(1, 50);

      expect(result.allow_operation).toEqual(true);
      expect(result.new_balance).toEqual(50);
    });

    it('should not allow the operation if the user has insufficient balance', async () => {
      jest
        .spyOn(users_service, 'find_by_id')
        .mockResolvedValue({ balance: 10 });

      const result = await service.verify_balance(1, 150);

      expect(result.allow_operation).toEqual(false);
    });
  });

  describe('is_valid_operation', () => {
    it('should validate the operation type and operands', () => {
      expect(service.is_valid_operation(OperationType.ADD, 1, 2)).toBe(true);
      expect(service.is_valid_operation(OperationType.SQUARE, 4)).toBe(true);
      expect(service.is_valid_operation(OperationType.DIV, 1, 0)).toBe(false);
      expect(service.is_valid_operation(OperationType.MULT)).toBe(false);
    });
  });

  describe('gen_random_string', () => {
    it('should generate a random string using random api', async () => {
      jest
        .spyOn(service.random_client, 'get')
        .mockImplementationOnce(jest.fn().mockResolvedValue({ data: 'random\n' }));

      const result = await service.gen_random_string();

      expect(result).toBe('random');
    });
  });
});
