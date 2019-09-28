const Queue = require('bull');
const { sendNewOrdertoCOJ, sendOrderConfirmationtoClient, sendShippingEmail } = require("../email");

const emailQueue = new Queue('Sending email', global.gConfig.redis);


emailQueue.process(function (job, done) {
    let { order, status } = job.data;
    switch (status) {
        case "ORDER_INIT":
            sendNewOrdertoCOJ(order);
            done();
            break;
        case "ORDER_CONFIRM":
            sendOrderConfirmationtoClient(order);
            done();
            break;
        case "ORDER_SHIP":
            sendShippingEmail(order);
            done();
            break;
        default:
            break;
    }

})

emailQueue.on('completed', (job, result) => {
    const { order, status } = job.data;
    switch (status) {
        case "ORDER_INIT":
            console.log(`ORDER PLACEMENT NOTIFICATION SENT: ${job.data.order.userID}`);
            break;
        case "ORDER_CONFIRM":
            console.log(`ORDER CONFIRMATION SENT: ${job.data.order.userID}`);
            break;
        case "ORDER_SHIP":
            console.log(`SHIPPING NOTIFICATION SENT: ${job.data.order.userID}`);
            break;
        default:
            break;
    }
})

module.exports = {
    emailQueue
}
