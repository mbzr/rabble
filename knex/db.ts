import knex from 'knex'
import _ from 'lodash'
import convertToCamel from 'camelcase-keys'
import knexConfig from '../knexfile'

let cached = global.pg
if (!cached) cached = global.pg = {}

function getKnex() {
  if (!cached.instance) {
    cached.instance = knex({
      ...knexConfig,
      postProcessResponse: (result, _queryContext) =>
        Array.isArray(result)
          ? result.map((row) => convertToCamel(row))
          : convertToCamel(result),
      wrapIdentifier: (value, origImpl) =>
        value === '*' ? '*' : origImpl(_.snakeCase(value)),
    })
  }

  return cached.instance
}

export default getKnex()
