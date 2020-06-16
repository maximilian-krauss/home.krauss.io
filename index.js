const Fastify = require('fastify')
const config = require('./config')

async function createAndRun () {
  const fastify = Fastify({ logger: true, trustProxy: true })
  fastify.setNotFoundHandler((_, reply) => reply.notFound())

  fastify
    .register(require('fastify-cors', { origin: true }))
    .register(require('fastify-sensible'))
    .route({
      method: 'GET',
      url: '/',
      handler: require('./handler/root')
    })

  await Promise.all([
    fastify.listen(config.server.port, '0.0.0.0'),
    fastify.ready()
  ])
}

createAndRun()
  .catch(err => console.error(err))
