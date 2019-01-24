const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")

const config = require("../../config")[process.env.NODE_ENV || "development"]

const checkJwt = expressJwt({ secret: config.secret }) // the JWT auth check middleware

const login = require("./auth")
const signup = require("./auth/signup")
const users = require("./users")

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED

// router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/users", users.find)
router.get("/user/:id", users.get)
router.post("/user", users.post)
router.put("/user/:id", users.put)
router.delete("/user/:id", users.delete)

module.exports = router
