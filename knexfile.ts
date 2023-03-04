import type { Knex } from 'knex'

const { loadEnvConfig } = require('@next/env')

const dev = process.env.NODE_ENV !== 'production'
const { PG_CONNECTION_STRING, PG_DB_HOST, PG_DB_NAME, PG_DB_USER, PG_DB_PWD } =
  loadEnvConfig('./', dev).combinedEnv

const knexConfig = {
  client: 'pg',
  connection:
    process.env.NODE_ENV === 'production'
      ? PG_CONNECTION_STRING
      : {
          host: PG_DB_HOST,
          database: PG_DB_NAME,
          user: PG_DB_USER,
          password: PG_DB_PWD,
        },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './knex/migrations',
    extension: 'ts',
    loadExtensions: [`.ts`],
    disableMigrationsListValidation: true,
  },
  seeds: {
    extension: 'ts',
    directory: './knex/seeds',
  },
} as Knex.Config

export default knexConfig
