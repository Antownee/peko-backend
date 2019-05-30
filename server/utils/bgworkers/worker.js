var Queue = require('bull');
const { sendEmailtoCOJ, sendEmailtoClient } = require("../email");

var emailQueue = new Queue('Sending email', global.gConfig.redis);

emailQueue.process(function (job, done) {
    // console.log(`Starting job: ${job.data.email}`);
    let { email, order, user } = job.data;
    if (user.role === "Admin") {
        //Order confirmation
        sendEmailtoClient(email, order)
    } else {
        //Order placing
        sendEmailtoCOJ(email, order)
    };
    done();
});

emailQueue.on('completed', (job, result) => {
    const {user} = job.data;
    user.role === "Admin" ?
        console.log(`ORDER CONFIRMATION SENT: ${job.data.email}`) :
        console.log(`ORDER PLACEMENT NOTIFICATION SENT: ${job.data.email}`);
})

function addEmailJob(email, order, user) {
    emailQueue.add({ email, order, user });
}

module.exports = {
    addEmailJob
}
