const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")
const randomstring = require("randomstring")

// const config = require('../config')[process.env.NODE_ENV || 'development'];
const mailer = require("../lib/mail")

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  phone: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  name: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },

  forgotpassword: {
    requestedAt: { type: Date, default: null },
    token: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

})


UserSchema.pre("validate", function (next) {
  if (this.isNew) {
    if (this.password === undefined || this.password === null) {
      this.generatedPassword = randomstring.generate(8) // for usage in post save hook to send welcome email
      this.password = this.generatedPassword
    }
  }
  return next()
})

// Save user's hashed password
UserSchema.pre("save", function (next) {
  const user = this
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err)
        return
      }
      bcrypt.hash(user.password, salt, null, (err1, hash) => {
        if (err1) {
          return next(err)
        }
        // saving actual password as hash
        user.password = hash
        return next()
      })
    })
  } else {
    next()
  }
})

// compare two passwords

UserSchema.methods.comparePassword = function (pw) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      if (isMatch === false) return reject(new Error("Credential Mismatch!"))
      return resolve("OK")
    })
  })
}
// eslint-disable-next-line prefer-arrow-callback
UserSchema.post("save", function (doc) {
  if (doc.generatedPassword !== undefined) {
    // Send welcome email, but NO WAITING!
    mailer("welcome", {
      to: doc.email,
      subject: "Welcome!!!",
      locals: { email: doc.email, password: doc.generatedPassword, name: doc.name }
    })
  }
})

UserSchema.virtual("name.full").get(function () {
  const first = (this.name.first === undefined || this.name.first === null)
    ? ""
    : this.name.first
  const last = (this.name.last === undefined || this.name.last === null)
    ? ""
    : ` ${this.name.last}`
  return `${first}${last}`
})
UserSchema.virtual("name.full").set(function (v) {
  this.name.first = v.substr(0, v.indexOf(" "))
  this.name.last = v.substr(v.indexOf(" ") + 1)
})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("User", UserSchema)
