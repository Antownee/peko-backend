var Queue = require('bull');

var emailQueue = new Queue('Sending email', 'redis://127.0.0.1:6379');

emailQueue.process(function (job, done) {
    setTimeout(() => {
        console.log("Done after 4 seconds.")
        done();
    }, 4000)

    //
    
    //done(null, { msg: "CONFIRMATION" });

    //throw new Error('some unexpected error');
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
