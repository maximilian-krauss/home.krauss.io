const { sensors, sentry } = require('../helper')

async function handleHtml (request, response) {
  try {
    const { id } = request.params
    const data = await sensors.getSensorDataById(id)
    return this.render('sensor',
      {
        ...data,
        sensorJson: JSON.stringify(data.current),
        historyJson: JSON.stringify(data.history)
      }, response)
  } catch (error) {
    sentry.captureException(error)
    throw error
  }
}

async function handleJson (request) {
  try {
    const { id } = request.params
    return sensors.getSensorDataById(id)
  } catch (error) {
    sentry.captureException(error)
    throw error
  }
}

module.exports = {
  html: handleHtml,
  json: handleJson
}
