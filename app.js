const createError = require("http-errors")
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const cors = require("cors")
const helmet = require("helmet")

require("dotenv").config()

const restRoutes = require("./routes/rest")
const webRoutes = require("./routes/web")

const app = express()

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== "development") {
  app.use(helmet())
}
app.use(cors())

// Database setup
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", webRoutes)
app.use(`/api/v${process.env.API_VERSION}`, restRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
