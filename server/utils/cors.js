// Set up a whitelist and check against it:
var whitelist = ['http://localhost:4895']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


module.exports = corsOptions;