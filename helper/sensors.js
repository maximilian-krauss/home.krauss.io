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

const mapSensor = sensor => ({
  ...sensor,
  isDoorSensor: sensor.type === 'dw'
})

const mapStateEvents = history => history
  .filter(({ property }) => property === 'state')
  .map(item => ({
    timestamp: item.timestamp,
    isClosed: item.value === 'close'
  }))

async function getAllSensors () {
  const sensors = await sql`SELECT * from "sensor_data" ORDER BY alias ASC`
  return sensors.map(mapSensor)
}

async function getSensorDataById (sensorId) {
  const [[current], history] = await Promise.all([
    sql`SELECT * from "sensor_data" WHERE id=${sensorId}`,
    sql`SELECT * FROM "sensor_data_history" WHERE id=${sensorId} ORDER BY "timestamp" DESC`
  ])
  const sensor = mapSensor(current)

  return {
    current: sensor,
    stateEvents: sensor.isDoorSensor ? mapStateEvents(history) : [],
    history
  }
}

module.exports = {
  updateSensorProperty,
  getAllSensors,
  archiveSensorValues,
  getSensorDataById
}
