import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/role.decorator';
import { User } from '../common/decorators/user.decorator';
import { IUser } from '../common/types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly users_service: UsersService) { }

    @Get('/balance')
    @Roles("user")
    async get_balance(@User() user: IUser) {
        const { balance } = await this.users_service.find_by_id(user.id);

        return { balance }
    }
    // @Post()
    // async create(@Body() user_data) {
    //     return this.users_service.create(user_data)
    // }
}
