npx mocha --timeout 10000 .\chai-http-js.js


npx mocha --timeout 10000 .\apiTesting.js



npm install supertest chai csv-parser mocha mochawesome mochawesome-merge mochawesome-report-generator --save-dev

npx mocha apiTesting1.js --reporter mochawesome
npx mocha apiTestingReport.js --reporter mochawesome

npx mocha apiTestingEnvReportCSV.js --reporter mochawesome

# For dotenv
npm install supertest chai mocha csv-writer dotenv --save-dev

# To Test
mocha testFileName.js --require dotenv/config



npm install supertest chai mocha csv-writer dotenv mochawesome --save-dev
mocha testFileName.js --require dotenv/config --reporter mochawesome --reporter-options reportDir=output/mochawesome-report,reportFilename=index


npx mocha apiTesting1.js --reporter mochawesome
