const Queue = require('bull');
const { sendNewOrdertoCOJ, sendShipmentNotificationtoClient } = require("../email");

const emailQueue = new Queue('Sending email', global.gConfig.redis);


emailQueue.process(function (job, done) {
    let { order, status, shipment } = job.data;
    switch (status) {
        case "ORDER_INIT":
            sendNewOrdertoCOJ(order);
            done();
            break;
        case "ORDER_SHIPMENT_ADDED":
            sendShipmentNotificationtoClient(shipment);
            done()
            break;
        default:
            break;
    }

})

emailQueue.on('completed', (job, result) => {
    const { order, status, shipment } = job.data;
    switch (status) {
        case "ORDER_INIT":
            console.log(`ORDER PLACED BY USER: ${order.userID}`);
            break;
        case "ORDER_SHIPMENT_ADDED":
            console.log(`SHIPMENT ADDED: ${shipment.shipmentID}`);
            break;
        default:
            break;
    }
})

module.exports = {
    emailQueue
}
