const postgres = require('postgres')
const { ok } = require('assert')
const { database: { uri } } = require('./../config')

ok(uri, `DATABASE_URL is not defined`)
const sql = postgres(uri, {
  max: 5,
  timeout: 5
})

module.exports = sql
