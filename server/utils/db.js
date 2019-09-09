const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(global.gConfig.database, { useCreateIndex: true, useNewUrlParser: true });

var db = mongoose.connection;

const connectWithRetry = () => {
  console.log('MongoDB connection retry..')
  return mongoose.connect(global.gConfig.database, { useCreateIndex: true, useNewUrlParser: true });
}


db.on('error', err=>{
  console.error.bind(console, 'connection error:')
  setTimeout(connectWithRetry, 5000)
});

db.once('open', function () {
  console.log('cup of joe has connected to the database.')
});

module.export = { mongoose };