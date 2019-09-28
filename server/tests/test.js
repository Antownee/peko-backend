
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
let should = chai.should();
let faker = require('faker');
let shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDVkMjQ4YmU2MDhlMjBhNDgxYmMzZTAiLCJpYXQiOjE1Njk2NDI5NTl9.Zg0pl2fkN45AoO5iRXIaY4UhP9trGxG_s8q64t1an5A";

let user = {
    userID: "COJ-GduzdBsWw",
    firstName: "user",
    lastName: "user",
    mail: "user@gmail.com",
    country: "Kenya",
    joinDate: "2019-09-24T11:02:22.848Z",
    username: "user",
    role: "User"
}



let tea = {
    teaID: "CH-6SJLyX16oj",
    teaName: "PF-1",
    teaDescription: "PF-1"
}


chai.use(chaiHttp);

describe('Order Actions', () => {
    describe('/POST api/users/order', () => {
        it('it should POST an order', (done) => {
            let order = {
                orderRequestID: `ORQ-${shortid.generate()}`,
                userID: "USR_15677",
                confirmed: false,
                requestDate: "2019-09-24T11:02:22.848Z",
                orderStatus: "ORDER_INIT",
                teaOrders: [{
                    teaID: "CH-rMCZVpxPQo",
                    teaName: "BF-1",
                    weight: 2345
                }]
            }
            chai.request(app)
                .post('/api/users/order')
                .set('authorization_token', token)
                .send({ order, user })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    })

    // describe('POST /api/admin/asset/dashboard', () => {
    //     it('it should GET the dashboard (both Admin and User)', () => {
    //         chai.request(app)
    //             .post('/api/admin/asset/dashboard')
    //             .set('authorization_token', token)
    //             .send({ user })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // })


    // describe('POST /api/users/order/all', () => {
    //     it('it should GET all orders (both Admin and User)', () => {
    //         chai.request(app)
    //             .post('/api/users/order/all')
    //             .set('authorization_token', token)
    //             .set('Content-Type', 'application/json')
    //             .send({ user })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // })



    // describe('POST /api/admin/order/delete', () => {
    //     it('it should DELETE an order (Admin)', () => {
    //         chai.request(app)
    //             .post('/api/admin/order/delete')
    //             .set('authorization_token', token)
    //             .set('Content-Type', 'application/json')
    //             .send({ order })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // })


    // describe('POST /api/admin/order/confirm', () => {
    //     it('it should confirm an order (Admin)', () => {
    //         chai.request(app)
    //             .post('/api/admin/order/confirm')
    //             .set('authorization_token', token)
    //             .set('Content-Type', 'application/json')
    //             .send({ user, order })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // });

    // describe('POST /api/admin/order/ship', () => {
    //     it('it should ship an order (Admin)', () => {
    //         chai.request(app)
    //             .post('/api/admin/order/ship')
    //             .set('authorization_token', token)
    //             .set('Content-Type', 'application/json')
    //             .send({ order, user })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // });

    // describe('POST /api/admin/asset/tea', () => {
    //     it('it should add Tea Asset (Admin)', () => {
    //         chai.request(app)
    //             .post('/api/admin/asset/tea')
    //             .set('authorization_token', token)
    //             .send({ tea })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // });

    // describe('POST /api/admin/asset/email', () => {
    //     it('it should add an Email Account (Admin)', () => {
    //         chai.request(app)
    //             .post('/api/admin/asset/email')
    //             .set('authorization_token', token)
    //             .send({ "email": faker.internet.email() })
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 done();
    //             });
    //     })
    // });
});