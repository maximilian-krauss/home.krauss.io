const sql = require('./sql')
const logger = require('./logger')

async function updateSensorProperty (sensorId, property, value) {
  const data = {
    id: sensorId,
    [property]: value,
    last_update: new Date()
  }

  await sql`INSERT INTO sensor_data ${sql(data, 'id', property, 'last_update')}
    ON CONFLICT (id) DO UPDATE
    SET ${sql(data, 'id', property, 'last_update')}`

  await sql`INSERT INTO sensor_data_history (id, timestamp, property, value)
  VALUES (${sensorId}, NOW(), ${property}, ${value})`

  logger.info(`Updated ${property}=${value} for sensor ${sensorId}`)
}

async function archiveSensorValues () {
  await sql`INSERT INTO historic_sensor_data
  SELECT id, NOW(), temperature, humidity FROM sensor_data;`

  await sql`DELETE FROM historic_sensor_data WHERE "timestamp" < (now() - '7 days'::interval);`
  await sql`REINDEX TABLE historic_sensor_data;`

  await sql`DELETE FROM sensor_data_history WHERE "timestamp" < (now() - '7 days'::interval);`
  await sql`REINDEX TABLE sensor_data_history;`
}

async function getAllSensors () {
  return sql`SELECT * from "sensor_data" ORDER BY last_update DESC`
}

async function getSensorDataById (sensorId) {
  const [[current], history] = await Promise.all([
    sql`SELECT * from "sensor_data" WHERE id=${sensorId}`,
    sql`SELECT * FROM "historic_sensor_data" WHERE id=${sensorId} ORDER BY "timestamp" DESC`
  ])

  return {
    current,
    history
  }
}

module.exports = {
  updateSensorProperty,
  getAllSensors,
  archiveSensorValues,
  getSensorDataById
}
