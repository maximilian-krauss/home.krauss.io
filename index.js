const Fastify = require('fastify')
const config = require('./config')
const { join } = require('path')
const { createReadStream } = require('fs')

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
      handler: require('./handler/root').html
    })
    .route({
      method: 'GET',
      url: '/sensor.json',
      handler: require('./handler/root').json
    })
    .route({
      method: 'GET',
      url: '/static/moment.min.js',
      handler: (_, reply) => {
        const filePath = join(__dirname, 'node_modules', 'moment', 'min', 'moment.min.js')
        const stream = createReadStream(filePath, { encoding: 'utf8' })
        reply
          .header('content-type', 'text/javascript')
          .send(stream)
      }
    })
    .route({
      method: 'GET',
      url: '/static/primer.min.css',
      handler: (_, reply) => {
        const filePath = join(__dirname, 'node_modules', '@primer', 'css', 'dist', 'primer.css')
        const stream = createReadStream(filePath, { encoding: 'utf8' })
        reply
          .header('content-type', 'text/css')
          .send(stream)
      }
    })

  await Promise.all([
    fastify.listen(config.server.port, '0.0.0.0'),
    fastify.ready()
  ])
}

createAndRun()
  .catch(err => console.error(err))
