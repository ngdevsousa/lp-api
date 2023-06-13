import { init_config } from './src/common/utils/env';
import { DataSource } from 'typeorm';

init_config()

export default new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'],
  port: parseInt(process.env['DB_PORT']),
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  entities: [],
  migrations: [`${__dirname}/src/database/migrations/*`]
});
