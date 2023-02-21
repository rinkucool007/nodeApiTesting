const supertest = require('supertest');
const chai = require('chai');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const expect = chai.expect;
const apiUrl = 'https://reqres.in'; // replace with your API URL

const csvWriter = createCsvWriter({
  path: 'output.csv', // name and path of the output CSV file
  header: [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Name' },
    { id: 'job', title: 'Job' },
  ]
});

describe('POST /api/users', () => {
  it('should create a new user with valid data', (done) => {
    const userData = {
            "name": "morpheus",
            "job": "leader"
        };
    supertest(apiUrl)
      .post('/api/users')
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log(err); // log error in console
          return done(err);
        }
        console.log(res.body); // log response in console

        const records = [
          {
            id: res.body.id,
            name: res.body.name,
            job: res.body.job
          }
        ];

        csvWriter.writeRecords(records) // write records to output CSV file
          .then(() => {
            console.log('Data added to CSV file');
            done();
          });
      });
  });
});
