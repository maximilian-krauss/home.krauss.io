const { createReadStream } = require('fs')
const { join } = require('path')

module.exports = async function (request, reply) {
  const filePath = join(__dirname, '..', 'assets', '.ping-file.js')
  const stream = createReadStream(filePath, 'utf8')
  return reply
    .type('text/javascript')
    .send(stream)
}
