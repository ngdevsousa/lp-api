import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ERROR_MESSAGES, RECORD_FIELDS } from '../common/contants';
import { ICreateRecord, IQueryRecord } from '../common/types';
import { Record } from '../database/entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private records_repository: Repository<Record>
  ) { }

  async find_all(user_id: number, options: IQueryRecord): Promise<any> {
    const { page_size = 10, page_number = 1, search = '', sort = 'DESC' } = options;
    const take = page_size;
    const skip = (page_number - 1) * take || 0;
    const search_term = `%${search}%`;

    const query = this.records_repository
      .createQueryBuilder('record')
      .select(RECORD_FIELDS)
      .skip(skip)
      .take(take)
      .orderBy('record.date', sort || 'DESC')
      .where('record.user_id = :user_id', { user_id: user_id })
      .andWhere('record.is_deleted = :is_deleted', { is_deleted: false })
      .leftJoinAndSelect('record.operation', 'operation')

    if (options.search)
      this.include_search_term(query, search_term);

    const [records, total_count] = await query.getManyAndCount();

    return { records, page_number, total_count }
  }

  async create(record_data: ICreateRecord) {
    try {
      const record_to_insert = this.prepare_for_insert(record_data);
      const record = await this.records_repository.save(record_to_insert);

      this.prepare_response(record);

      return record;
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException(ERROR_MESSAGES.INTERNAL);
    }
  }

  prepare_response(record: Partial<Record>) {
    delete record.is_deleted;
    delete record.user_id;
    delete record.operation_id;
  }

  async mark_as_deleted(record_id: number, user_id: number) {
    try {
      await this.records_repository
        .createQueryBuilder('records')
        .update(Record)
        .set({ is_deleted: true })
        .where('records.id = :id', { id: record_id })
        .andWhere('records.user_id = :user_id', { user_id: user_id })
        .execute()
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException(ERROR_MESSAGES.INTERNAL);
    }
  }

  prepare_for_insert(record_data: ICreateRecord): Partial<Record> {
    const { operation, user_id, balance, operation_response } = record_data;
    const record = new Record();

    record.user_id = user_id;
    record.operation = operation;
    record.amount = operation.cost;
    record.user_balance = balance;
    record.operation_response = operation_response;
    record.is_deleted = false;
    record.date = new Date();

    return record;
  }

  private include_search_term(query, search_term: string) {
    query
      .andWhere(
        new Brackets(queryBuilder => {
          queryBuilder
            .where('operation.type ILike :search', { search: search_term })
            .orWhere('record.operation_response ILike :search', { search: search_term });
        })
      );
  }
}
