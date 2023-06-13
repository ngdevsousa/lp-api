import { Controller, Delete, Get, Param, Query, UsePipes } from '@nestjs/common';
import { Roles } from '../common/decorators/role.decorator';
import { User } from '../common/decorators/user.decorator';
import { IQueryRecord, IUser } from '../common/types';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor(private readonly records_service: RecordsService) { }

    @Get()
    @Roles("user")
    async find_all(@Query() query: IQueryRecord, @User() user: IUser) {
        return this.records_service.find_all(user.id, query);
    }

    @Delete('/:id')
    @Roles('user')
    async mark_as_deleted(@Param('id') record_id: number, @User() user: IUser) {
        await this.records_service.mark_as_deleted(record_id, user.id)
    }
}
