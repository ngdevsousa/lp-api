import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Roles } from '../common/decorators/role.decorator';
import { User } from '../common/decorators/user.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { IUser } from '../common/types';
import { CreateDTO } from './dtos/create.dto';
import { OperationsService } from './operations.service';

@Controller('operations')
export class OperationsController {
    constructor(private readonly operations_service: OperationsService){}

    @Post()
    @Roles('user')
    @UsePipes(new ValidationPipe())
    async create(@Body() operation_data: CreateDTO, @User() user_data: IUser) {
        return this.operations_service.create(operation_data, user_data);
    }
}
