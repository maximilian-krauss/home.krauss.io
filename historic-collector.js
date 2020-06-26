const cron = require('node-cron')
const { sensors, logger } = require('./helper')

async function startArchiveTask () {
  cron.schedule('*/30 * * * *', () => {
    sensors.archiveSensorValues()
      .then(() => {
        logger.info('Sensor data archived')
      })
      .catch(error => {
        logger.error(error, `Failed to archive sensor data: ${error.message}`)
      })
  })
  logger.info('Scheduled archive task has been created')
}

module.exports = {
  startArchiveTask
}
