const Email = require("email-templates")
const {
  SMTP_HOST, SMTP_PORT, SMTP_FROM_ADDRESS, SMTP_AUTH_USER, SMTP_AUTH_PASSWORD
} = process.env

module.exports = (template, {
  to, subject, locals, attachments = [], from = null, replyTo = null, send = true
}) => new Email({
  message: {
    from: from || SMTP_FROM_ADDRESS,
    replyTo: replyTo || from || SMTP_FROM_ADDRESS
  },
  send, // set to false for dry-runs
  transport: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // use SSL
    auth: {
      user: SMTP_AUTH_USER,
      pass: SMTP_AUTH_PASSWORD
    }
  },
  views: {
    options: {
      extension: "ejs"
    }
  }
}).send({
  template,
  message: {
    to,
    subject,
    attachments
  },
  locals
})
