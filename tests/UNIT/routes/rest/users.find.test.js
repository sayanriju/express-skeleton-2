/* eslint-disable no-param-reassign */
import test from "ava"
const faker = require("faker")

const { runRouteHandler, beforeHookMongo, afterHookMongo } = require("../../../_utils")
const User = require("../../../../models/user")
const { find } = require("../../../../routes/rest/users") // function to unit test

test.before(beforeHookMongo)
test.after.always(afterHookMongo)


test.beforeEach(async (t) => {
  // fixture data set:
  faker.seed(123)
  const fixture = Array(5).fill().map(x => ({
    email: faker.internet.email(),
    name: faker.name.findName(),
    password: faker.internet.password
  }))
  t.context.fixture = fixture
  await User.create(fixture)
})
test.afterEach(async (t) => {
  await User.remove({})
})

test.serial("my passing test", async (t) => {
  const { status, body } = await runRouteHandler(find)
  t.is(status, 200)
  t.is(body.users.length, 5)
})

test.serial("my passing test 2", async (t) => {
  const { status, body } = await runRouteHandler(find)
  t.is(status, 200)
  t.is(body.users[0].email, t.context.fixture[0].email.toLowerCase())
})
