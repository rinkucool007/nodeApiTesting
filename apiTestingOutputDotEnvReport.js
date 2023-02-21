const supertest = require('supertest');
const chai = require('chai');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dotenv = require('dotenv');
const mocha = require('mocha');
const mochawesome = require('mochawesome');
const fs = require('fs');
const path = require('path');

const expect = chai.expect;
const apiUrl = process.env.API_URL;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const csvWriter = createCsvWriter({
  path: 'output.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
  ]
});

const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

dotenv.config();

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
      .set('client_id', clientId)
      .set('client_secret', clientSecret)
      .expect(201)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        console.log(res.body);

        const records = [
          {
            id: res.body.id,
            name: res.body.name,
            email: res.body.email
          }
        ];

        csvWriter.writeRecords(records)
          .then(() => {
            console.log('Data added to CSV file');
            done();
          });
      });
  });
});

mocha.reporter('mochawesome');
mocha.addFile(path.join(outputDir, 'mochawesome-report/mochawesome.html'));

