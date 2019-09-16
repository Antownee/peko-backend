const Queue = require('bull');
const { sendNewOrdertoCOJ, sendOrderConfirmationtoClient, sendShippingEmail } = require("../email");

const emailQueue = new Queue('Sending email', global.gConfig.redis);

function addEmailJob(orderInfo) {
    emailQueue.add(orderInfo);
}

emailQueue.process(function (job, done) {
    let { email, order, user, status } = job.data;
    switch (status) {
        case "PLACE ORDER":
            sendNewOrdertoCOJ(email, order);
            done();
            break;
        case "CONFIRM":
            sendOrderConfirmationtoClient(email, order);
            done();
            break;
        case "SHIP":
            sendShippingEmail(email, order);
            done();
            break;
        default:
            break;
    }

});

emailQueue.on('completed', (job, result) => {
    const { user, order, status } = job.data;
    switch (status) {
        case "PLACE ORDER":
            console.log(`ORDER PLACEMENT NOTIFICATION SENT: ${job.data.email}`);
            break;
        case "CONFIRM":
            console.log(`ORDER CONFIRMATION SENT: ${job.data.email}`);
            break;
        case "SHIP":
            console.log(`SHIPPING NOTIFICATION SENT: ${job.data.email}`);
            break;
        default:
            break;
    }
})

module.exports = {
    addEmailJob
}
