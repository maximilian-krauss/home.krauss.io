const NodeCache = require('node-cache')
const requestCache = new NodeCache({
  stdTTL: 60 * 5,
  checkperiod: 120,
  deleteOnExpire: true,
  maxKeys: 50 * 1000
})

module.exports = {
  set (key) {
    requestCache.set(key, 'ping')
  },
  hasKey (key) {
    return requestCache.get(key) !== undefined
  }
}
