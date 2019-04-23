const expressJwt = require('express-jwt');
const User = require('../models/user');

module.exports = jwt;

function jwt() {
    const secret = process.env.secret;
    return expressJwt({ secret, isRevoked });
}

function isRevoked(req, payload, done) {
    User.findById(payload.sub, (err, user) => {
        if (err) { return done(err) };
        if (!user) { return done(null, true) };

    })
    done();
};