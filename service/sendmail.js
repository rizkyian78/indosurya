const axios = require("axios")

const sendMail = async (email, message) => {
 return axios.default.post(process.env.SEND_EMAIL_URL, {
    email,
    message
      }).catch(err => {
        console.log(err, "got an error, and will retry")
        sendMail(email, message)
      }).then(res => true)
} 

module.exports = sendMail