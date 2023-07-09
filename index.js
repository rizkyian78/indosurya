require("dotenv").config()
const express = require("express")
const app = express()
const AmqpMailer = require("./observer/amqp-mailer.observer")
const UserRouter = require("./router/user")
const cron = require("node-cron")
const user = require("./controller/user")

const mailerService = new AmqpMailer()

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(UserRouter)

cron.schedule("* */1 * * *", user.cronSendEmail)

app.listen(port, () => {
mailerService.start()
console.log("Running on port: ", port)
})

