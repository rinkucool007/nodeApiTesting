const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const csv = require('csv-parser');
const fs = require('fs');

const API_URL = 'https://your-api-url.com';
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';

function postRequest(data) {
  return request(API_URL)
    .post('/your-endpoint')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`)
    .send(data);
}

describe('Your POST service', function() {
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', function(data) {
      it(`should return a successful response with data ${JSON.stringify(data)}`, function(done) {
        postRequest(data)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.property('status').that.equals('success');
            done(err);
          });
      });
    });
});
