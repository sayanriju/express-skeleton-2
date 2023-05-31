const pino = require("pino")

const targets = [{
  target: "pino-pretty", options: { ignore: "pid,hostname", translateTime: "dd/mm/yy HH:MM:ss" }
}]

if (process.env.LOG_FILE_PATH !== undefined && process.env.LOG_FILE_PATH.trim() !== "") {
  targets.push({
    target: "pino/file",
    level: process.env.LOG_FILE_LEVEL || "error",
    options: { destination: process.env.LOG_FILE_PATH, mkdir: true },
  })
}

if (process.env.ENABLE_GRAFANA_LOGS === "yes") {
  targets.push({
    target: "pino-loki",
    options: {
      batching: true,
      interval: 5,

      labels: {
        app: process.env.GRAFANA_APP_LABEL || "express-skeleton"
      },
      host: process.env.GRAFANA_HOST,
      basicAuth: {
        username: process.env.GRAFANA_USER,
        password: process.env.GRAFANA_PASS,
      },
    },
  })
}

module.exports = pino({
  enabled: process.env.NODE_ENV !== "test",
  transport: { targets }
})
