const P = require('pino')

require('dotenv').config()

const { env } = process

module.exports = {
  environment: env.NODE_ENV,
  database: {
    uri: env.DATABASE_URL
  },
  weather: {
    accessKey: env.WEATHER_ACCESS_KEY,
    city: env.WEATHER_CITY
  },
  mqtt: {
    url: env.MQTT_URL,
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    topics: [
      'shellies/+/sensor/#'
    ]
  },
  redis: {
    url: env.REDIS_URL
  },
  server: {
    port: Number.parseInt(env.PORT || 3000, 10)
  }
}
