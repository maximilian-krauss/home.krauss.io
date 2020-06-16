require('dotenv').config()

module.exports = {
  database: {
    uri: process.env.DATABASE_URL
  },
  server: {
    port: Number.parseInt(process.env.PORT || 3000, 10)
  }
}
