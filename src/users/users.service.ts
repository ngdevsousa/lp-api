import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES, JWT_EXP_IN_SECONDS } from '../common/contants';
import { UserStatus } from '../common/types';
import { tokenUtils } from '../common/utils/jwt';
import { User } from '../database/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users_repository: Repository<User>,
  ) { }

  async create(user_data: Partial<User>) {

    const user_already_exists = await this.find_by_name(user_data.username);

    if (user_already_exists)
      throw new HttpException(ERROR_MESSAGES.INVALID_USERNAME, HttpStatus.BAD_REQUEST);

    const user_to_insert: User = await this.prepare_for_insert(user_data);
    try {
      const user = await this.users_repository.save(user_to_insert);
      delete user.password;

      const access_token = tokenUtils.encode_jwt_token({
        sub: user.id,
        token_type: "access",
        expires_in: JWT_EXP_IN_SECONDS
      })

      return { access_token, expires_in: JWT_EXP_IN_SECONDS }
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException(ERROR_MESSAGES.INTERNAL)
    }
  }

  private async prepare_for_insert(user_data: Partial<User>): Promise<User> {
    const user: User = new User();
    user.username = user_data.username;
    user.password = await bcrypt.hash(user_data.password, 12);
    user.status = UserStatus.ACTIVE;
    user.balance = 100;

    return user;
  }

  async find_by_name(username: string): Promise<User | null> {
    return this.users_repository.findOneBy({ username });
  }

  async find_by_id(id: number): Promise<Partial<User> | null> {
    return this.users_repository.findOne({
      where: { id },
      select: ['id', 'username', 'status', 'balance']
    });
  }

  async update_balance(user_id, new_balance) {
    try {
      await this.users_repository
        .createQueryBuilder('users')
        .update(User)
        .set({ balance: new_balance })
        .andWhere('users.id = :user_id', { user_id: user_id })
        .execute()
    } catch (error) {
      Logger.error(error)
      throw new InternalServerErrorException(ERROR_MESSAGES.INTERNAL);
    }
  }
}
