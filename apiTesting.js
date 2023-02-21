const supertest = require('supertest');
const chai = require('chai');
const csv = require('csv-parser');
const fs = require('fs');

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

describe('GET /api/users', () => {
  it('should return all users', (done) => {
    supertest(apiUrl)
      .get('/api/users')
      .end((err, res) => {
        if (err) return done(err);
        // assertions for successful response
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.has.lengthOf.at.least(2);
        done();
      });
  });
});
