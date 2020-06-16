const { sql } = require('./../helper')
const rateLimiter = require('./../helper/rate-limiter')

async function updatePageCount (pageId, visitorIp, logger) {
  logger.info({ pageId, visitorIp }, 'updatePageCount')

  const [ result ] = await sql`SELECT hits FROM pings WHERE id = ${pageId}`
  const hits = (result ? result.hits : 0) + 1

  const visitorKey = `${visitorIp}:${pageId}`
  if (rateLimiter.hasKey(visitorKey)) {
    logger.info({ pageId, visitorIp, result }, 'Rate Limit reached')
    return hits
  }

  rateLimiter.set(visitorKey)

  await (!result
    ? sql`INSERT INTO pings ${sql({ id: pageId }, 'id')}`
    : sql`UPDATE pings SET "hits" = ${hits}, "lastHit" = ${new Date()} WHERE id = ${pageId}`)

  return hits
}

module.exports = async function (request, response) {
  if (!request.query.p) return response.status(400).send()
  const requestIp = [...request.ips].pop()
  const { p } = request.query
  const page = decodeURIComponent(p)

  const hits = await updatePageCount(page, requestIp, request.log)

  return {
    hits,
    pong: true,
    timestamp: new Date().toISOString()
  }
}
