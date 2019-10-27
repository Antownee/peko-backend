const Queue = require('bull');
const { sendNewOrdertoCOJ, sendShipmentNotificationtoClient } = require("../email");

const emailQueue = new Queue('Sending email', global.gConfig.redis);


emailQueue.process(function (job, done) {
    let { status, shipment } = job.data;
    switch (status) {
        case "ORDER_INIT":
            sendNewOrdertoCOJ();
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
    const { userID, status, shipment } = job.data;
    switch (status) {
        case "ORDER_INIT":
            console.log(`ORDER PLACED BY USER: ${userID}`);
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
