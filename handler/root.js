const { sql, weather } = require('./../helper')

async function fetchSensorData () {
  return sql`SELECT * from "sensor_data" ORDER BY alias ASC`
  // return results.map(item => ({ ...item, lastUpdate: item.last_update.toISOString() }))
}

async function fetchData () {
  const [sensorData, currentWeather] = await Promise.all([fetchSensorData(), weather.fetchCurrent()])
  return { sensorData, currentWeather }
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
