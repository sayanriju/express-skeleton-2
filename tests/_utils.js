const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const httpMocks = require("node-mocks-http")

let mongod
mongoose.set("strictQuery", true)

module.exports = {
  async beforeHookMongo(t) {
    mongod = await MongoMemoryServer.create()
    await mongoose.connect(await mongod.getUri())
  },
  async afterHookMongo(t) {
    await mongoose.disconnect()
    await mongod.stop()
  },
  async runRouteHandler(fn, req = {}) {
    const request = httpMocks.createRequest({
      method: "GET", // default
      url: "/", // default
      ...req
    })
    const response = httpMocks.createResponse()
    await fn(request, response)
    return {
      status: response.statusCode,
      body: JSON.parse(response._getData())
    }
  }
}
