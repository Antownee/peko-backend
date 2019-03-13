const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const logger = require('morgan');

//Run db
const { mongoose } = require('./db.js');

/// init ///
const app = express();
const port = process.env.port;

//Bring in models
const Sale = require('./models/sale');
const Tea = require('./models/tea');
const TeaRequest = require('./models/teaRequest');

//Routers
const userRouter = require('./router/user');
const saleRouter = require('./router/sale');
const teaRouter = require('./router/tea');
const teaRequestRouter = require('./router/tea-request');

app.use('/user', userRouter);
app.use('/sale', saleRouter);
app.use('/tea', teaRouter);
app.use('/tea-request', teaRequestRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));


app.get('/', (req, res) => {
    return res.send('Welcome to COJ online portal')
})

app.listen(port, () => {
    console.log(`cup of joe is running on PORT ${port}`)
})