const nodemailer = require("nodemailer");
const { format } = require("date-fns");
const orderService = require("./orderService");

module.exports = {
    sendNewOrdertoCOJ,
    sendOrderConfirmationtoClient,
    sendShippingEmail
}

async function sendShippingEmail(order) {
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
    let email = await orderService.getUserEmail(order.userID);
    let info = await transporter.sendMail({
        from: '"COJ System" <coj@example.com>',
        to: `${email}`,
        subject: "ORDER SHIPPING",
        text: `Your order ${order.orderRequestID} has been shipped and the estimated time of arrival is 3 months.
                Your patience while the order arrives is highly appreciated.
                Thank you for partenering with us
                
                Regards,
                Cup of Joe.`
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function sendNewOrdertoCOJ(order) {
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

    let emails = await orderService.getCOJEmails();
    for (let index = 0; index < emails.length; index++) {
        let info = await transporter.sendMail({
            from: '"COJ System" <coj@example.com>',
            to: `${emails[index]}`,
            subject: "ORDER CONFIRMATION",
            text: `A new order has been placed by user id: ${order.userID}. Kindly head to the portal to confirm the order.`
        });
    
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); 
        
    }
    
}


async function sendOrderConfirmationtoClient(order) {
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

    let email = await orderService.getUserEmail(order.userID);
    let info = await transporter.sendMail({
        from: '"Cup of Joe" <coj@example.com>',
        to: `${email}`,
        subject: "ORDER CONFIRMATION",
        text: `Order No: ${order.orderRequestID} which you placed on ${format(order.requestDate, "DD/MM/YYYY")} has beeen approved. 
                Proceed to the portal to upload the necessary documents to complete your order.


                Regards,
                Cup of Joe.`
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
