const postgres = require('postgres')
const { ok } = require('assert')
const { database: { uri } } = require('./../config')

ok(uri, 'DATABASE_URL is not defined')
const sql = postgres(uri, {
  ssl: {
    rejectUnauthorized: false
  },
  max: 1,
  timeout: 3
})

module.exports = sql
