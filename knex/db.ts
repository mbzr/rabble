import knex from 'knex'
import _ from 'lodash'
import convertToCamel from 'camelcase-keys'
import knexConfig from '../knexfile'

const db = knex({
  ...knexConfig,
  postProcessResponse: (result, _queryContext) =>
    Array.isArray(result)
      ? result.map((row) => convertToCamel(row))
      : convertToCamel(result),
  wrapIdentifier: (value, origImpl) =>
    value === '*' ? '*' : origImpl(_.snakeCase(value)),
})

export default db
