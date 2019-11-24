const express = require('express');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const seed = require('./utils/seed/seed');
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");

//Sentry config
Sentry.init({ dsn: 'https://57af6529557442cf95c516bf787d0f08@sentry.io/1546068' });

//Run db
const { mongoose } = require('./utils/db.js');

/// init ///
const app = express();
app.enable("trust proxy");
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(hpp());
app.disable("x-powered-by");

//Router
const apiRouter = require('./router/apiRouter');
const authRouter = require('./router/authRouter');

app.use(favicon(path.join(__dirname, '../client/assets/favicon.ico')));
app.use(express.static(path.join(__dirname, '../client/build')));//Front end
app.use(express.static(path.join(__dirname, '../documents'))); //Client documents

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use(errorHandler);

//Check if server is alive
app.get('/alive', (req, res) => {
    return res.send('COJ server is alive.')
})

//Seed the DB
app.get('/seed', (req, res) => {
    //Seed the db with an Admin user and initial tea types as well as the emails to be used for communication
    seed.createAdmin()
        .then(() => {
            seed.addTeaTypes().then(() => { return res.send('Seeding complete.') });
        })
})

//Load the front end
app.get('/*', function (req, res) {
    return res.sendFile('index.html', { root: '../client/build' });
    //return res.sendFile(path.resolve(__dirname, '../client/build/index.html', 'index.html'))
});

app.listen(global.gConfig.port, () => {
    console.log(`cup of joe is running on PORT ${global.gConfig.port}`)
})

// Export our app for testing purposes
module.exports = app;