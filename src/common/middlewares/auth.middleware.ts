/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common"
import { Request, Response } from "express"
import { UsersService } from "../../users/users.service"
import { TokenOptions, UserStatus } from "../types"
import { tokenUtils } from "../utils/jwt"
import { DEFAULT_ROLE } from "../contants"

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly user_service: UsersService) { }

    async use(req: Request, res: Response, next: Function): Promise<void> {
        try {
            const auth_token = req.header("Authorization")
            if (auth_token == null)
                return next()

            const token = tokenUtils.parse_token(auth_token, "bearer")
            if (token != null) {
                const { sub } = tokenUtils.decode_jwt_token<TokenOptions>(token)

                const user = await this.user_service.find_by_id(sub)
                if (!user || user.status !== UserStatus.ACTIVE)
                    throw new UnauthorizedException()
                req["user"] = {...user, role: DEFAULT_ROLE}
            }
            next()
        } catch (error) {
            next(new UnauthorizedException(error.message))
        }
    }
}
