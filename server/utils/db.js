const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(global.gConfig.database, { useCreateIndex: true, useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('cup of joe has connected to the database.')
});

module.export = { mongoose };