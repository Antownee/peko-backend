const { format } = require("date-fns");
const orderService = require("./orderService");
const sgMail = require('@sendgrid/mail');
const Sentry = require('@sentry/node');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {
    sendNewOrdertoCOJ,
    sendShipmentNotificationtoClient,
}

async function sendNewOrdertoCOJ(order) {
    let emails = await orderService.getCOJEmails();

    const msg = {
        to: emails,
        from: 'Cup Of Joe <portal@cupofjoe.co.ke>',
        subject: 'ORDER CONFIRMATION',
        text: 'Hello plain world!',
        html: `A new order has been placed by user id: ${order.userID}. 
        Kindly head to the portal to confirm the order.`,
    };
    sgMail.send(msg)
        .then((res) => {
            //Log email sent
            console.log("NEW ORDER NOTIFICATIONS SENT")
        }).catch((err) => {
            Sentry.captureException(err);
        })
}


async function sendShipmentNotificationtoClient(shipment) {
    let { email } = await orderService.getUserEmail(shipment.orderID);
    const msg = {
        to: email,
        from: 'Cup Of Joe <portal@cupofjoe.co.ke>',
        subject: 'SHIPMENT CREATION',
        text: `Shipment No. ${shipment.shipmentID} has been added to your recent order ${shipment.orderID} which you placed on ${format(shipment.shipmentDate, "DD/MM/YYYY")}.
        Proceed to the portal to upload the necessary documents to complete your order.
        Regards,
        Cup of Joe.`.trim()
    };
    sgMail.send(msg)
        .then((res) => {
            //Log email sent
            console.log(`NEW SHIPMENT NOTIFICATION : ${email}`)
        }).catch((err) => {
            Sentry.captureException(err);
        })
}
