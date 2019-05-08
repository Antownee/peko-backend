const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const faker = require('faker');
const logger = require('morgan');
const errorHandler = require('./utils/errorHandler');
const cors = require('cors');
const port = process.env.port;

//Run db
const { mongoose } = require('./utils/db.js');

/// init ///
const app = express();
const corsOptions = require("./utils/cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
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

app.listen(port, () => {
    console.log(`cup of joe is running on PORT ${port}`)
})