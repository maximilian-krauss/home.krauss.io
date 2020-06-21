const { get } = require('got').default
const { weather: { city, accessKey } } = require('./../config')

async function fetchCurrent () {
  const result = await get('http://api.weatherstack.com/current', {
    searchParams: {
      query: city,
      access_key: accessKey
    }
  }).json()

  const { current: { temperature, humidity, weather_icons: [icon], weather_descriptions: [description] } } = result
  return {
    description,
    temperature,
    humidity,
    icon
  }
}

module.exports = {
  fetchCurrent
}
