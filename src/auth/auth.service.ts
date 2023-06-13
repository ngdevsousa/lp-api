import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JWT_EXP_IN_SECONDS } from '../common/contants';
import { IAuthResponse, IAuthToken } from '../common/types';
import { tokenUtils } from '../common/utils/jwt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly users_service: UsersService) { }

    async login(credentials: LoginDTO): Promise<IAuthResponse> {
        const user = await this.users_service.find_by_name(credentials.username)
        if (!user || !user.password)
            throw new UnauthorizedException("Invalid login/password")

        const password_match = await bcrypt.compare(credentials.password, user.password)
        if (!password_match)
            throw new UnauthorizedException("Invalid login/password")

        return { ...this.get_access_token(user.id), balance: user.balance }
    }

    get_access_token(sub: number): IAuthToken {
        const access_token = tokenUtils.encode_jwt_token({ sub, expires_in: JWT_EXP_IN_SECONDS })

        return { access_token, expires_in: JWT_EXP_IN_SECONDS }
    }
}
