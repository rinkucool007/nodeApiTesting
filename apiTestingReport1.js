const supertest = require('supertest');
const chai = require('chai');
const csv = require('csv-parser');
const fs = require('fs');

const mocha = require('mocha');
const { merge } = require('mochawesome-merge');
const reportGenerator = require('mochawesome-report-generator');

const expect = chai.expect;
const apiUrl = 'https://reqres.in'; // replace with your live API URL

describe('POST /api/users', () => {
  it('should create a new user with valid data', (done) => {
    fs.createReadStream('testData.csv')
      .pipe(csv())
      .on('data', (data) => {
        supertest(apiUrl)
          .post('/api/users')
          .send({
            name: data.name,
            job: data.job
          })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            // assertions for successful response
            expect(res.body).to.have.property('id');
            expect(res.body.name).to.equal(data.name);
            expect(res.body.job).to.equal(data.job);
          });
      })
      .on('end', () => {
        done();
      });
  });
});

