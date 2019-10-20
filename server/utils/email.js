const nodemailer = require("nodemailer");
const { format } = require("date-fns");
const orderService = require("./orderService");

module.exports = {
    sendNewOrdertoCOJ,
    sendShipmentNotificationtoClient,
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


async function sendShipmentNotificationtoClient(shipment) {
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

    let email = await orderService.getUserEmail(shipment.orderID);
    let info = await transporter.sendMail({
        from: '"Cup of Joe" <coj@example.com>',
        to: `${email}`,
        subject: "SHIPMENT CREATION",
        text: `Shipment No: ${shipment.shipmentID} has been added to your recent order ${shipment.orderID} which you placed on ${format(shipment.shipmentDate, "DD/MM/YYYY")}.
                Proceed to the portal to upload the necessary documents to complete your order.


                Regards,
                Cup of Joe.`
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
