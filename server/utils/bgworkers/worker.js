var Queue = require('bull');
const { sendEmail } = require("../email");

var emailQueue = new Queue('Sending email', 'redis://127.0.0.1:6379');

emailQueue.process(function (job, done) {
    console.log(`Starting job: ${job.data.email}`);

    sendEmail(job.data.email);
    done();
});

emailQueue.on('completed', (job, result) => {
    console.log(`ORDER CONFIRMATION SENT: ${job.data.email}`);
})

function addEmailJob(email) {
    emailQueue.add({ email: `${email}` });
}

module.exports = {
    addEmailJob
}
