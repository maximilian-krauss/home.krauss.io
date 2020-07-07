const { weather, sensors, sentry } = require('../helper')

async function fetchData () {
  try {
    const [sensorData, currentWeather] = await Promise.all([
      sensors.getAllSensors(),
      weather.fetchCurrent()
    ])
    return { sensorData, currentWeather }
  } catch (error) {
    sentry.captureException(error)
    throw error
  }
}

async function handleHtml (request, response) {
  const data = await fetchData()
  return this.render('index', data, response)
}

async function handleJson (request, response) {
  const data = await fetchData()
  return data
}

module.exports = {
  html: handleHtml,
  json: handleJson
}
