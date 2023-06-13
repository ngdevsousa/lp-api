import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get_mocked_query_builder } from '../../test/helpers/typeorm.helper';
import { ICreateRecord } from '../common/types';
import { Record } from '../database/entities';
import { RecordsService } from './records.service';

describe('RecordsService', () => {
  let service: RecordsService;
  let record_repository = get_mocked_query_builder()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordsService, {
        provide: getRepositoryToken(Record),
        useValue: record_repository
      }],
    }).compile();

    service = module.get<RecordsService>(RecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find_all', () => {
    it('should return paginated records', async () => {
      const mocked_user_id = 1;
      const mocked_record: Partial<Record> = {
        id: 1,
        amount: 200
      }
      record_repository.getManyAndCount.mockResolvedValue([[mocked_record], 1]);

      const result = await service.find_all(mocked_user_id, {});

      expect(result)
        .toEqual({ records: [mocked_record], page_number: 1, total_count: 1 });
      expect(record_repository.where)
        .toBeCalledWith('record.user_id = :user_id', { user_id: mocked_user_id })
    });
  });

  describe('create', () => {
    it('should create a record', async () => {
      const record_data = { operation: { cost: 10 }, user_id: 1, balance: 100, operation_response: '10' };
      const saved_record = {
        ...record_data,
        id: 1,
        user_balance: 100,
        is_deleted: false,
        date: new Date()
      };

      record_repository.save.mockResolvedValue(saved_record);

      const result = await service.create(record_data as ICreateRecord);

      expect(result).toEqual(saved_record);
      expect(record_repository.save).toBeCalledTimes(1);
    });
  });

  describe('mark_as_deleted', () => {
    it('should mark a record as deleted', async () => {
      await service.mark_as_deleted(1, 1);

      expect(record_repository.execute).toBeCalledTimes(1);
      expect(record_repository.andWhere).toBeCalledTimes(2);
      expect(record_repository.set).toBeCalledWith({ is_deleted: true });
    });
  });

  describe('prepareResponse', () => {
    it('should remove internal fields from response', () => {
      const response: Partial<Record> = {
        id: 1,
        is_deleted: false,
        user_id: 2,
        operation_id: 3
      }

      service.prepare_response(response)
      const expectedResult: Partial<Record> = { id: 1 }

      expect(response).toEqual(expectedResult);
    });
  });
});
