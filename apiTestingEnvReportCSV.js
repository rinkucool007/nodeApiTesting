const supertest = require('supertest');
const chai = require('chai');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mocha = require('mocha');
const mochawesome = require('mochawesome');

const expect = chai.expect;
const apiUrl = process.env.API_URL;
//const clientId = process.env.CLIENT_ID;
//const clientSecret = process.env.CLIENT_SECRET;

dotenv.config();
describe('REST API Testing', () => {
  let api;

  before((done) => {
    api = supertest(apiUrl);
    done();
  });

  it('should test REST service with payload as input from CSV file', (done) => {
    const results = [];
    fs.createReadStream(path.resolve(__dirname, 'testData.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        const csvWriter = createCsvWriter({
          path: 'output.csv',
          header: [
            { id: 'input', title: 'Input' },
            { id: 'output', title: 'Output' },
            { id: 'result', title: 'Result' },
          ],
        });

        const testResults = results.map((result) => {
          return new Promise((resolve, reject) => {
            api
              .post('/api/users')
              .send({
                input: result.input,
              })
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(201)
              .end((err, res) => {
                if (err) {
                  result.result = 'Failed';
                  csvWriter.writeRecords([result]).then(() => {
                    reject(err);
                  });
                } else {
                  expect(res.body).to.deep.equal(result.output);
                  result.result = 'Passed';
                  csvWriter.writeRecords([result]).then(() => {
                    resolve();
                  });
                }
              });
          });
        });

        Promise.all(testResults)
          .then(() => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });
});

mocha
  .reporter('mochawesome')
  .reporterOptions({
    reportFilename: 'report',
    reportDir: 'reports',
    reportTitle: 'REST API Testing Report',
    reportPageTitle: 'REST API Testing Dashboard',
    reportUseInlineAssets: true,
    reportAssetsPath: 'assets',
  })
  .run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
