const Fastify = require('fastify')
const config = require('./config')
const { join } = require('path')

async function createAndRun () {
  const fastify = Fastify({ logger: true, trustProxy: true })
  fastify.setNotFoundHandler((_, reply) => reply.notFound())

  fastify
    .register(require('fastify-cors', { origin: true }))
    .register(require('fastify-sensible'))
    .register(require('point-of-view'), {
      engine: { handlebars: require('handlebars') },
      options: { partials: { layout: 'layout.hbs' } },
      includeViewExtension: true,
      templates: join(__dirname, 'views/')
    })
    .decorate('render', async (view, options, reply) => {
      return reply.code(200)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(await fastify.view(view, options))
    })
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
