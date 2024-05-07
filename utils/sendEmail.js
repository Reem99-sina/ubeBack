const nodeoutlook = require('nodejs-nodemailer-outlook');
// const nodemailer=require("nodemailer")
async function sendEmail(dest, message) {
        nodeoutlook.sendEmail({
            auth: {
                user: "reemsina1@outlook.com",
                pass: "a6dg7ia4"
            },
            from: 'reemsina1@outlook.com',
            to: dest,
            subject: 'Hey you, awesome!',
            html: message,
            text: 'This is text version!',
            replyTo: 'receiverXXX@gmail.com',
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        })
}
module.exports = sendEmail