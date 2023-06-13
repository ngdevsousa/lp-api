import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { OperationType } from "../../common/types"

export class CreateDTO {
    @IsNumber()
    @IsOptional()
    x?: number

    @IsNumber()
    @IsOptional()
    y?: number

    @IsNotEmpty()
    @IsEnum(OperationType)
    type: OperationType
}