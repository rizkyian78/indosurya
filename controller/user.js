const {User} = require("../helper/instance")
const timezonesCountry = require("../helper/timezones")
const dayjs = require("dayjs")
const timezone = require("dayjs/plugin/timezone")
const utc = require("dayjs/plugin/utc")
const {Op} = require("sequelize")
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
    delete: (req, res) => {
        User.destroy({
            where: {
                id: req.params.id
            }
        })
       return res.status(200).json({message: "User deleted"})
    },

    create: async (req, res) => {

        if(!timezonesCountry.includes(req.body.location)) {
            return res.status(400).json({message: "Bad Request", timezonesAvailable: timezonesCountry})
        }
        const data = await User.create({
            ...req.body,
            birthdayDate: dayjs(req.body.birthdayDate).format("MM-DD")
        })
        return res.status(200).json(data)
    },
    cronSendEmail: async () => {
        const users = await User.findAll({
            where: {
                birthdayDate: dayjs().format("MM-DD"),
                [Op.or]: [{
                    lastSend: null,
                }, {lastSend: {
                    [Op.ne]: dayjs().toDate()
                }}]
            }
        })
        users.forEach(user => {
            if(dayjs.tz(new Date(), user.location).hour() === 21) {
            amqp.publish("mail.sendbirthday", {"message":`Hey, ${user.firstName + " " + user.lastName} it's your birthday`, id: user.id, email: user.email})
            }
        })
    }
}