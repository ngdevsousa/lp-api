import { CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { DEFAULT_ROLE } from "../contants"

export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler())
    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const { user } = request
    if(!user)
      return false

    const match_role = this.matchRoles(roles, DEFAULT_ROLE)
    return match_role
  }

  matchRoles(values: string[], target: string): boolean{
    const is_valid = values.find(role => role === target)
    return !!is_valid
  }
}
