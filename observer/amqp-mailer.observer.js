const { User } = require("../helper/instance")
const AMQP = require("../service/amqp.service")
const sendMail = require("../service/sendmail")

const amqp = new AMQP()

module.exports = class AmqpMailerService {
    start() {
        amqp.consumeQueue("mail.sendbirthday", async msg => {
            const json = JSON.parse(msg.content.toString())
            const isSended = await sendMail(json.email, json.message)
            if(isSended) {
                await User.update({lastSend: new Date()}, {where: {
                    id: json.id
                }})
            }
        })        
    }
}

