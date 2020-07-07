const { sentry, environment } = require('./../config')
const Sentry = require('@sentry/node')

Sentry.init({
  environment,
  dsn: sentry.dsn
})

module.exports = Sentry
