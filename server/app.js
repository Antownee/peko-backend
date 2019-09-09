const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const Sentry = require('@sentry/node');

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

app.use('/users', userRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    return res.send('Welcome to COJ online portal')
})

app.listen(global.gConfig.port, () => {
    console.log(`cup of joe is running on PORT ${global.gConfig.port}`)
})
