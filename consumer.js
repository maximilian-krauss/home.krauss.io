const MQTT = require('async-mqtt')
const { logger, sensors, sentry } = require('./helper')
const { environment, mqtt: { url, username, password, topics } } = require('./config')

async function handleMessage (topic, message) {
  const value = message.toString()
  logger.info({ topic, value })

  const [, sensorId,, property] = topic.split('/')
  try {
    await sensors.updateSensorProperty(sensorId, property, value)
  } catch (error) {
    logger.error(error, `Failed to update sensor data ${error.message}`)
    sentry.captureException(error)
  }
}

async function startConsuming () {
  if (environment === 'local') {
    logger.warn('Consumer paused due to local development, change NODE_ENV to start consuming')
    return true
  }

  const client = await MQTT.connectAsync(url, {
    username,
    password,
    clientId: 'home-krauss-io-consumer'
  })

  const errorHandler = err => {
    client.end(true)
    throw new Error(err)
  }

  client.on('error', errorHandler)
  client.on('close', () => errorHandler('Connection to client closed unexpectedly'))
  client.on('disconnect', () => errorHandler('Connection to client disconnected unexpectedly'))
  client.on('end', () => logger.info('mqtt connection ended'))
  client.on('message', handleMessage)

  await Promise.all(topics.map(topic => client.subscribe(topics)))

  logger.info({ url, topics }, 'Connected and subscribed, waiting for messages')
}

module.exports = {
  startConsuming
}
