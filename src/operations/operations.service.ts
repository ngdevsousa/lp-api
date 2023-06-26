import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { RecordsService } from '../records/records.service';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES, OP_COSTS, RANDOM_BASE_URL } from '../common/contants';
import { IBalanceInfo, OperationType } from '../common/types';
import { Operation, Record, User } from '../database/entities';
import { UsersService } from '../users/users.service';
import { CreateDTO } from './dtos/create.dto';

@Injectable()
export class OperationsService {
    random_client: AxiosInstance;
    constructor(
        @InjectRepository(Operation)
        private operations_repository: Repository<Operation>,
        private readonly records_service: RecordsService,
        private readonly users_service: UsersService
    ) {
        this.random_client = axios.create({
            baseURL: RANDOM_BASE_URL
        })
    }

    async create(operation_data: CreateDTO, user: Partial<User>): Promise<Partial<Record>> {
        try {
            const { operation_to_insert, new_balance } = await this.prepare_for_insert(operation_data.type, user.id);
            const operation_response = await this.process_operation(operation_data);

            return this.operations_repository.manager.transaction(async trx => {
                const operation = await trx.save(operation_to_insert);
                const record = await this.records_service.create({
                    operation,
                    user_id: user.id,
                    balance: new_balance,
                    operation_response: operation_response.toString()
                }, trx);

                await this.users_service.update_balance(user.id, record.user_balance, trx);
                return record;
            });
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async prepare_for_insert(type: OperationType, user_id: number) {
        const operation_cost = OP_COSTS[type];
        const { allow_operation, new_balance }
            = await this.verify_balance(user_id, operation_cost);

        if (!allow_operation)
            throw new BadRequestException(ERROR_MESSAGES.NO_BALANCE)

        const operation_to_insert = new Operation();
        operation_to_insert.type = type;
        operation_to_insert.cost = operation_cost;

        return { operation_to_insert, new_balance };
    }

    async process_operation(op_data: CreateDTO): Promise<number | string> {
        if (!this.is_valid_operation(op_data.type, op_data.x, op_data.y))
            throw new BadRequestException(ERROR_MESSAGES.INVALID_OP);

        switch (op_data.type) {
            case OperationType.ADD:
                return op_data.x + op_data.y;
            case OperationType.SUB:
                return op_data.x - op_data.y;
            case OperationType.MULT:
                return op_data.x * op_data.y;
            case OperationType.DIV:
                return op_data.x / op_data.y;
            case OperationType.SQUARE:
                return Math.sqrt(op_data.x);
            case OperationType.RANDOM:
                const randomString = await this.gen_random_string();
                return randomString;
            default:
                throw new BadRequestException(ERROR_MESSAGES.UNSUPPORTED_OP);
        }
    }

    async verify_balance(user_id: number, cost: number): Promise<IBalanceInfo> {
        const { balance } = await this.users_service.find_by_id(user_id);
        const new_balance = balance - cost;

        return new_balance >= 0 ? {
            allow_operation: true,
            new_balance
        } : { allow_operation: false }
    }

    is_valid_operation(type: OperationType, x?: number, y?: number) {
        if (type === OperationType.RANDOM)
            return true
        if (type === OperationType.SQUARE && x !== undefined)
            return true
        if (x === undefined || y === undefined)
            return false
        if (type === OperationType.DIV && y === 0)
            return false
        return true
    }

    async gen_random_string(): Promise<string> {
        const url = '/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new';
        const random_string = await this.random_client.get<string>(url);

        return random_string.data.replace(/\n/g, '');
    }
}
