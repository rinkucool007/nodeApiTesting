const supertest = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const csv = require('csv-parser');
const fs = require('fs');
const mochawesome = require('mochawesome');

describe('Data-Driven API Test', function () {
  let server;
  before(function () {
    server = supertest.agent('https://reqres.in');
  });

  it('should test POST API with multiple data', function (done) {
    fs.createReadStream('testData.csv')
      .pipe(csv())
      .on('data', function (data) {
        server
          .post('/api/users')
          .send(data)
          .expect(201)
          .end(function (err, res) {
            if (err) {
              done(err);
            }
            assert.equal(res.body.status, 'success');
          });
          console.log(res.body); // log response in console
      })
      .on('end', function () {
        done();
      });
  });
});
