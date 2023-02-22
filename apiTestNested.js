const csv = require('fast-csv');
const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const api = supertest('https://example.com');

describe('Nested JSON data from CSV test', function() {
  let data = [];

  before(function(done) {
    csv.parseFile('input.csv', { headers: true })
      .on('data', function(row) {
        // Construct the nested JSON object from the row data
        const userData = {
          name: row.name,
          email: row.email,
          address: {
            street: row.street,
            city: row.city,
            state: row.state,
            zip: row.zip
          }
        };
        // Add the nested JSON object to the data array
        data.push(userData);
      })
      .on('end', function() {
        done();
      });
  });

  // Loop through each data object and send a request to the API server
  data.forEach(function(userData) {
    it(`should create a new user with name ${userData.name}`, function(done) {
      api.post('/users')
        .send(userData)
        .end(function(err, res) {
          expect(res.status).to.equal(201);
          expect(res.body.name).to.equal(userData.name);
          expect(res.body.email).to.equal(userData.email);
          expect(res.body.address.street).to.equal(userData.address.street);
          expect(res.body.address.city).to.equal(userData.address.city);
          expect(res.body.address.state).to.equal(userData.address.state);
          expect(res.body.address.zip).to.equal(userData.address.zip);
          done();
        });
    });
  });
});
