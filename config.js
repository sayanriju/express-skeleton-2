module.exports = {
  development: {
    apiVersion: "1",
    secret: "bd17ddffc6694d25834a99ac2708a498",
    database: "mongodb://localhost:27017/skeleton",
    siteUrl: "http://localhost:3000",
    email: {
      from: "s26c.sayan@gmail.com",
      host: "smtp-pulse.com",
      port: 465,
      auth: {
        user: "s26c.sayan@gmail.com",
        pass: "topsecret"
      }
    }
  }
}
