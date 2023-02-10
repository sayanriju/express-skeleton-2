const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const httpMocks = require("node-mocks-http")
const Fixtures = require("node-mongodb-fixtures")

let mongod
mongoose.set("strictQuery", true)

module.exports = {
  async setupMongo(t) {
    mongod = await MongoMemoryServer.create()
    // eslint-disable-next-line no-param-reassign
    t.context.mongoUri = await mongod.getUri()
    await mongoose.connect(t.context.mongoUri)
  },
  async teardownMongo(t) {
    await mongoose.disconnect()
    await mongod.stop()
  },

  async setupFixtures(t) {
    // eslint-disable-next-line no-param-reassign
    t.context.fixtures = new Fixtures({
      dir: "tests/_fixtures",
      mute: true
    })
    await t.context.fixtures.connect(t.context.mongoUri)
    await t.context.fixtures.unload()
    await t.context.fixtures.load()
  },
  async teardownFixtures(t) {
    await t.context.fixtures.unload()
    await t.context.fixtures.disconnect()
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
