const { get } = require('got').default

const accessKey = '8443fba9b44316a1e3bd53689e8b106f'
const city = 'berlin'

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
