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

module.exports = pino({
  enabled: process.env.NODE_ENV !== "test",
  transport: { targets }
})
