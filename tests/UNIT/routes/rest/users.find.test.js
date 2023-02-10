/* eslint-disable no-param-reassign */
const test = require("ava")
const sinon = require("sinon")

const {
  runRouteHandler, setupMongo, teardownMongo, setupFixtures, teardownFixtures
} = require("../../../_utils")
const User = require("../../../../models/user")
const { find } = require("../../../../routes/rest/users") // function to unit test

/** Setup & Teardown code (COMMON) */
test.before(setupMongo)
test.after.always(teardownMongo)
test.beforeEach(setupFixtures)
test.afterEach(teardownFixtures)
/* ******************************* */

test.serial("Users.find: my passing test", async (t) => {
  const { status, body } = await runRouteHandler(find)
  t.is(status, 200)
  t.false(body.error)
  t.is(body.users.length, 1)
  t.is(body.users[0].email, "foo@bar.com")
  t.is(body.users[0].name.full, "Foo Bar")
})

test.serial("Users.find: If DB ops throw an error, status should be 500", async (t) => {
  sinon.stub(User, "find").throws(new Error("Dummy DB Error!!"))
  const { status, body } = await runRouteHandler(find)
  t.is(status, 500)
  t.is(body.reason, "Dummy DB Error!!")
})
