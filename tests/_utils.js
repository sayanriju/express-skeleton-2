const MongodbMemoryServer = require("mongodb-memory-server").default
const mongoose = require("mongoose")

const httpMocks = require("node-mocks-http")


const mongod = new MongodbMemoryServer()

module.exports = {
  async beforeHookMongo(t) {
    mongoose.connect(await mongod.getConnectionString(), { useNewUrlParser: true })
  },
  async afterHookMongo(t) {
    mongoose.disconnect()
    mongod.stop()
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
