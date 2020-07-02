const { sensors } = require('../helper')

async function handleHtml (request, response) {
  const { id } = request.params
  const data = await sensors.getSensorDataById(id)
  return this.render('sensor', { ...data, historyJson: JSON.stringify(data.history) }, response)
}

module.exports = {
  html: handleHtml
}
