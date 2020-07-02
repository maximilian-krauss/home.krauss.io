const Fastify = require('fastify')
const config = require('./config')
const { join } = require('path')
const { createReadStream } = require('fs')
const { logger } = require('./helper')

async function handleStaticRoute (request, reply, assetLocation, assetContentType) {
  const filePath = join(__dirname, 'node_modules', assetLocation)
  const stream = createReadStream(filePath, { encoding: 'utf8' })
  return reply
    .header('content-type', assetContentType)
    .send(stream)
}

async function createAndRun () {
  const fastify = Fastify({ logger, trustProxy: true })
  fastify.setNotFoundHandler((_, reply) => reply.notFound())

  fastify
    .register(require('fastify-cors', { origin: true }))
    .register(require('fastify-compress'))
    .register(require('fastify-sensible'))
    .register(require('point-of-view'), {
      engine: { handlebars: require('handlebars') },
      options: { partials: { layout: 'layout.hbs' } },
      includeViewExtension: true,
      templates: join(__dirname, 'views/')
    })
    .decorate('render', async (view, options, reply) => reply.code(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(await fastify.view(view, options))
    )
    .route({
      method: 'GET',
      url: '/',
      handler: require('./handler/index').html
    })
    .route({
      method: 'GET',
      url: '/index.json',
      handler: require('./handler/index').json
    })
    .route({
      method: 'GET',
      url: '/sensor/:id',
      handler: require('./handler/sensor').html
    })
    .route({
      method: 'GET',
      url: '/static/moment.min.js',
      handler: async (request, reply) => handleStaticRoute(request, reply, 'moment/min/moment.min.js', 'text/javascript')
    })
    .route({
      method: 'GET',
      url: '/static/chart.min.js',
      handler: async (request, reply) => handleStaticRoute(request, reply, 'chart.js/dist/Chart.bundle.min.js', 'text/javascript')
    })
    .route({
      method: 'GET',
      url: '/static/primer.min.css',
      handler: async (request, reply) => handleStaticRoute(request, reply, '@primer/css/dist/primer.css', 'text/css')
    })

  const [, server] = await Promise.all([
    fastify.listen(config.server.port, '0.0.0.0'),
    fastify.ready()
  ])

  return server
}

module.exports = {
  createAndRun
}
