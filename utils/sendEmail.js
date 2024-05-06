const nodeoutlook = require('nodejs-nodemailer-outlook');

function sendEmail(dest, message) {
    nodeoutlook.sendEmail({
        auth: {
            user:"reemsina23@outlook.com",
            pass:"a6dg7ia4"
        },
        from: "reemsina23@outlook.com",
        to: dest,
        subject: 'Hey you, awesome!',
        html: message,
        text: 'This is text version!',
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i),
        attachments: [{
            filename: 'text1.txt',
            content: 'hello world!'
        }
        ]
    })
}
module.exports = sendEmail