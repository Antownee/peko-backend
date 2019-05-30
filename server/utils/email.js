const nodemailer = require("nodemailer");
const { format } = require("date-fns");

module.exports = {
    sendEmailtoCOJ,
    sendEmailtoClient
}

async function sendEmailtoCOJ(email, order) {
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
        from: '"COJ System" <coj@example.com>',
        to: `${email}`,
        subject: "ORDER CONFIRMATION",
        text: `A new order has been placed by user id: ${order.userID}. Kindly head to the portal to confirm the order.`
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


async function sendEmailtoClient(email, order) {
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
        text: `Order No: ${order.orderRequestID} which you placed on the ${order.requestDate}has beeen approved. 
                Proceed to the portal to upload the necessary documents to complete your order.


                Regards,
                Cup of Joe.`
    });

    // console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
