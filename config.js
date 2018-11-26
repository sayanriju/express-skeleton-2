module.exports = {
  development: {
    apiVersion: "1",
    secret: process.env.SECRET || "7 for secret cannot be told",
    database: process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017/skeleton",
    redisUrl: process.env.REDIS_CONNECTION_STRING,
    siteUrl: process.env.SITE_URL || "http://localhost:3000",
    smtp: {
      from: process.env.SMTP_FROM_ADDRESS,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASSWORD
      }
    }
  }
}
