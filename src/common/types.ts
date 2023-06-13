import { Operation } from "../database/entities/operation.entity"

export interface IUser {
    id: number
    name: string
}

export interface TokenOptions {
    sub: number
    token_type?: "access"
    expires_in?: number
}

export interface IAuthToken {
    access_token: string
    expires_in: number
}

export interface IAuthResponse extends IAuthToken {
    balance: number
}

export interface ICreateRecord {
    operation: Operation
    user_id: number
    balance: number
    operation_response: string
}

export interface IBalanceInfo {
    allow_operation: boolean,
    new_balance?: number
}

export interface IQueryRecord {
    sort?: SortOptions,
    search?: string,
    page_size?: number,
    page_number?: number
}

export enum SortOptions {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export enum OperationType {
    ADD = 'addition',
    SUB = 'subtraction',
    MULT = 'multiplication',
    DIV = 'division',
    SQUARE = 'square_root',
    RANDOM = 'random_string',
}