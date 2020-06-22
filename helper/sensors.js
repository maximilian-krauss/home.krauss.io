const sql = require('./sql')
const logger = require('./logger')

async function updateSensorProperty (sensorId, property, value) {
  const data = {
    id: sensorId,
    [property]: value,
    last_update: new Date()
  }

  await sql`INSERT INTO sensor_data ${sql(data, 'id', property, 'last_update')}
    ON CONFLICT (id)
    DO
    UPDATE
    SET ${sql(data, 'id', property, 'last_update')}`

  logger.info(`Updated ${property}=${value} for sensor ${sensorId}`)
}

async function getAllSensors () {
  return sql`SELECT * from "sensor_data" ORDER BY last_update DESC`
}

module.exports = {
  updateSensorProperty,
  getAllSensors
}
