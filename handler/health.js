const { sql } = require('./../helper')
module.exports = async function (request, response) {
  const [ready] = await sql`SELECT 'yes' AS ready WHERE 1=1`

  return response.send({
    db: ready,
    timestamp: new Date().toISOString()
  })
}
