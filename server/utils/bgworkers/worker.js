var Queue = require('bull');
const { sendNewOrdertoCOJ, sendOrderConfirmationtoClient, sendShippingEmail } = require("../email");

var emailQueue = new Queue('Sending email', global.gConfig.redis);

emailQueue.process(function (job, done) {
    let { email, order, user } = job.data;
    if (user.role === "User") sendNewOrdertoCOJ(email, order);
    if (order.orderPosition === 0) sendOrderConfirmationtoClient(email, order);
    if (order.orderPosition === 2) sendShippingEmail(email, order);
    done();
});

emailQueue.on('completed', (job, result) => {
    const { user, order } = job.data;
    if (user.role === "User") console.log(`ORDER PLACEMENT NOTIFICATION SENT: ${job.data.email}`);
    if (user.role === "Admin" && order.orderPosition === 0) console.log(`ORDER CONFIRMATION SENT: ${job.data.email}`);
    if (order.orderPosition === 2) console.log(`SHIPPING NOTIFICATION SENT: ${job.data.email}`);
})

function addEmailJob(email, order, user) {
    emailQueue.add({ email, order, user });
}

module.exports = {
    addEmailJob
}
