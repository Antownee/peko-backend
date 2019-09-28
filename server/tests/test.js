
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
let should = chai.should();
const shortid = require('shortid');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDVkMjQ4YmU2MDhlMjBhNDgxYmMzZTAiLCJpYXQiOjE1Njk2NDI5NTl9.Zg0pl2fkN45AoO5iRXIaY4UhP9trGxG_s8q64t1an5A";

//Required
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

chai.use(chaiHttp);

describe('User Actions', () => {
    describe('/POST api/users/order-request', () => {
        it('it should POST an order', (done) => {
            chai.request(app)
                .post('/api/users/order-request')
                .set('authorization_token', token)
                .send(
                    {
                        orderRequestID: `ORQ-${shortid.generate()}`,
                        requestDate: Date.now().toString(),
                        teaID: "CH-rMCZVpxPQo",
                        amount: 1500,
                        notes: "Best tea in the land",
                        userID: "COJ-bPnSTh6OZ",
                        confirmed: false,
                        orderPosition: 0,
                        orderShipped: false
                    }
                )
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
                .catch(function (err) {
                    throw err;
                });
        });
    });


});