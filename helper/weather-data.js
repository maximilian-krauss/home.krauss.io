const { get } = require('got').default
const { weather: { city, accessKey }, redis, environment } = require('./../config')
const logger = require('./logger')
const Redis = require('ioredis')

const redisClient = new Redis(redis.url, { db: 0 })
redisClient.on('error', error => logger.error(error, `redis client reported an error: ${error.message}`))

const cacheKey = `home:weather:${environment}`

async function fetchCurrent () {
  const cachedResult = await redisClient.get(cacheKey)
  if (cachedResult) {
    return JSON.parse(cachedResult)
  }

  const result = await get('http://api.weatherstack.com/current', {
    searchParams: {
      query: city,
      access_key: accessKey
    }
  }).json()

  const { current: { temperature, humidity, weather_icons: [icon], weather_descriptions: [description] } } = result
  const data = {
    description,
    temperature,
    humidity,
    icon,
    last_update: (new Date()).toISOString()
  }

  await redisClient.set(cacheKey, JSON.stringify(data), 'EX', 30 * 60)

  return data
}

module.exports = {
  fetchCurrent
}
