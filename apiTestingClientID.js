const supertest = require('supertest');
const chai = require('chai');

const expect = chai.expect;
const apiUrl = 'http://your-api-url.com'; // replace with your API URL
const clientId = 'your-client-id'; // replace with your client ID
const clientSecret = 'your-client-secret'; // replace with your client secret

describe('POST /api/users', () => {
  it('should create a new user with valid data', (done) => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    };
    supertest(apiUrl)
      .post('/api/users')
      .send(userData)
      .set('client_id', clientId) // set client ID in request header
      .set('client_secret', clientSecret) // set client secret in request header
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log(err); // log error in console
          return done(err);
        }
        console.log(res.body); // log response in console
        // assertions for successful response
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal(userData.name);
        expect(res.body.email).to.equal(userData.email);
        done();
      });
  });
});
