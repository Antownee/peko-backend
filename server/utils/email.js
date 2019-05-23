const nodemailer = require("nodemailer");

module.exports = {
    sendEmail
}

const emailToCOJ = `A new order ORQ-KZjcYHO2D has been placed. Kindly head to the portal to complete the order.

                    [INSERT ORDER DETAILS HERE]`;

const emailToClient = `Order No: ORQ-KZjcYHO2D which you placed on the 12/05/2019 has beeen approved. 
                    Proceed to the portal to upload the necessary documents to complete your order.


                    Regards,
                    Cup of Joe.`

async function sendEmail(email) {
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
        text: emailToCOJ
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
