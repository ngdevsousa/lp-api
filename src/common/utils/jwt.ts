import { HttpException, HttpStatus } from "@nestjs/common"
import * as jwt from "jsonwebtoken"
import { TokenOptions } from "../types"
import { init_config } from "./env"

init_config()

export const TokenParseReg = /^(\w+) (\S+)$/
export const tokenUtils = {
    verify_token(token: string): unknown {
        if (!token)
            throw new HttpException("Invalid token", HttpStatus.BAD_REQUEST)

        return jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
            issuer: "domain"
        })
    },
    parse_token(input: string, type: string): string {
        const match = TokenParseReg.exec(input)
        if (match && match[1].toLowerCase() == type) {
            return match[2]
        }
    },
    decode_jwt_token<T>(token: string): T {
        if (this.verify_token(token)) {
            const decodedToken: unknown = jwt.decode(token)
            return decodedToken as T
        }
    },
    encode_jwt_token(options: TokenOptions): string {
        const token = jwt.sign(
            { sub: options.sub, token_type: options.token_type || "access" },
            process.env.JWT_SECRET,
            {
                expiresIn: options.expires_in || 900,
                algorithm: "HS256",
                issuer: "domain"
            }
        )

        return token
    }
}
