const createError = require("http-errors")
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")

require("dotenv").config()
const config = require("./config")[process.env.NODE_ENV || "development"]

const restRoutes = require("./routes/rest")
const webRoutes = require("./routes/web")

const app = express()

// Database setup
mongoose.Promise = global.Promise
mongoose.connect(config.database, { useNewUrlParser: true })

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", webRoutes)
app.use(`/api/v${config.apiVersion}`, restRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
