const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const Sentry = require('@sentry/node');
const seed = require('./utils/seed/seed');

//Sentry config
Sentry.init({ dsn: 'https://57af6529557442cf95c516bf787d0f08@sentry.io/1546068' });

//Run db
const { mongoose } = require('./utils/db.js');

/// init ///
const app = express();
const corsOptions = require("./utils/cors");
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorHandler);

//Router
const userRouter = require('./router/userRouter');
const adminRouter = require('./router/adminRouter');
const apiRouter = require('./router/apiRouter');

app.use('/api', apiRouter)

app.get('/alive', (req, res) => {
    return res.send('COJ server is alive.')
})

app.get('/seed', (req, res) => {
    //Seed the db with an Admin user and initial tea types as well as the emails to be used for communication
    seed.createAdmin()
        .then(() => {
            seed.addTeaTypes().then(() => { return res.send('Seeding complete.') });
        })
})

app.listen(global.gConfig.port, () => {
    console.log(`cup of joe is running on PORT ${global.gConfig.port}`)
})
