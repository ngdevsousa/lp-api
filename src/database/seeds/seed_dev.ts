import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { UserStatus } from '../../common/types';

export async function seed(knex: Knex): Promise<void> {
    const table_name = 'users'

    // Deletes ALL existing entries
    await knex(table_name).del();

    // Inserts seed entries
    const passwordHash = await bcrypt.hash('password', 12)
    await knex(table_name).insert([
        {
            id: 1,
            username: 'dev@email.com',
            password: passwordHash,
            status: UserStatus.ACTIVE,
            balance: 100
        }
    ]);
};
