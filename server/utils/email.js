const nodemailer = require("nodemailer");
const {format} = require("date-fns");

module.exports = {
    sendEmail
}

function emailToCOJ(order) {
    return `A new order ${order.orderRequestID} has been placed. Kindly head to the portal to complete the order.

            Details

            Tea Type: ${order.teaID}
            Date: ${format(order.requestDate, 'do MMM,YYYY')}
            Weight: ${order.amount.toLocaleString()} kgs
            Notes: ${order.notes}`
}

function emailToClient(order) {
    return `Order No: ${order.orderRequestID} which you placed on the ${order.requestDate}has beeen approved. 
            Proceed to the portal to upload the necessary documents to complete your order.


            Regards,
            Cup of Joe.`
}

async function sendEmail(email, order) {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    let info = await transporter.sendMail({
        from: '"Cup of Joe" <coj@example.com>',
        to: `${email}`,
        subject: "ORDER CONFIRMATION",
        text: emailToCOJ(order)
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
