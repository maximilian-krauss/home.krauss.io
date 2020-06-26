const { createAndRun } = require('./server')
const { startConsuming } = require('./consumer')
const { startArchiveTask } = require('./historic-collector')
const { logger } = require('./helper')

async function startApplication () {
  await Promise.all([
    createAndRun(),
    startConsuming(),
    startArchiveTask()
  ])
}

startApplication()
  .catch(error => {
    logger.error(error, `Application failed to start: ${error.message}`)
    setTimeout(() => process.exit(-1), 100)
  })
