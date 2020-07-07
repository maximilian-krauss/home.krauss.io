const { sensors, sentry } = require('../helper')

async function handleHtml (request, response) {
  try {
    const { id } = request.params
    const data = await sensors.getSensorDataById(id)
    return this.render('sensor', { ...data, historyJson: JSON.stringify(data.history) }, response)
  } catch (error) {
    sentry.captureException(error)
    throw error
  }
}

module.exports = {
  html: handleHtml
}
