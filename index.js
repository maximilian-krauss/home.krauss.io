const { createAndRun } = require('./server')
const { startConsuming } = require('./consumer')
const { logger } = require('./helper')

async function startApplication () {
  await Promise.all([
    createAndRun(),
    startConsuming()
  ])
}

startApplication()
  .catch(error => {
    logger.error(error, `Application failed to start: ${error.message}`)
    setTimeout(() => process.exit(-1), 100)
  })
