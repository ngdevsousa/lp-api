import { Knex } from "knex"
import { init_config } from "./src/common/utils/env";

init_config()
const DB_URL = `postgres://${process.env['DB_USER']}:${process.env['DB_PASS']}@${process.env['DB_HOST']}:${process.env['DB_PORT']}/${process.env['DB_NAME']}`;


module.exports = {
  development: {
    client: 'pg',
    connection: DB_URL,
    seeds: {
      directory: './src/database/seeds',
    },
    useNullAsDefault: true,
  },
} as Knex.Config;