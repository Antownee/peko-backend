const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const logger = require('morgan');
const errorHandler = require('./utils/errorHandler');

//Run db
const { mongoose } = require('./db.js');

/// init ///
const app = express();
const port = process.env.port;

//Router
const userRouter = require('./router/userRouter');
const adminRouter = require('./router/adminRouter');

app.use('/user', userRouter);
app.use('/admin', adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(errorHandler);


app.get('/', (req, res) => {
    return res.send('Welcome to COJ online portal')
})

app.listen(port, () => {
    console.log(`cup of joe is running on PORT ${port}`)
})