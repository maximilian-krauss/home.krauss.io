const { sql } = require('./../helper')

async function fetchSensorData () {
  return sql`SELECT * from "sensor_data" ORDER BY alias ASC`
}

module.exports = async function (request, response) {
  const sensorData = await fetchSensorData()
  return this.render('index', { sensorData }, response)
}
