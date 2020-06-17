const { sql } = require('./../helper')
const { get } = require('got').default

async function fetchSensorData () {
  return sql`SELECT * from "sensor_data" ORDER BY alias ASC`
}

async function fetchCurrentWeather () {
  const result = await get('http://api.weatherstack.com/current?access_key=8443fba9b44316a1e3bd53689e8b106f&query=Berlin').json()
  console.log(result)
  const { current: { temperature, humidity, weather_icons: [icon], weather_descriptions: [description] } } = result
  return {
    description,
    temperature,
    humidity,
    icon
  }
}

module.exports = async function (request, response) {
  const [sensorData, currentWeather] = await Promise.all([fetchSensorData(), fetchCurrentWeather()])
  return this.render('index', { sensorData, currentWeather }, response)
}
