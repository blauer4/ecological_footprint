
const request = require('supertest');

const url = process.env.HEROKU || "http://localhost:3000"


describe('Login testing', () => {

    it('logging in with valid credentials', (done) => {
        
        const user = { email: 'laurence@foo.com', password: "ciao" }
        const expectedResponse = []
        request(url)
        .post('/api/v1/login')
        .send(user)
        .end((err, res) => {
            expect(res.body.success).toEqual(true)
            done();
        })

    });

    it('logging in with valid mail but non-valid password', (done) => {
        
        const user = { email: 'laurence@foo.com', password: "foo" }
        const expectedResponse = []
        request(url)
        .post('/api/v1/login')
        .send(user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false)
            done();
        })

    });

    it('logging in with non-valid credentials', (done) => {
        
        const user = { email: 'foo', password: "foo" }
        const expectedResponse = []
        request(url)
        .post('/api/v1/login')
        .send(user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false)
            done();
        })

    });

});

