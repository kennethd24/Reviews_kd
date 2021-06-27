const config = './config';
const { Client } = require('pg');
const csv = require('csv-parse');
const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

const client = new Client(config.postgres);

client.connect((err) => (err ? console.error(err) : console.log('Database Success')));

const filePath = path.join(__dirname, './reviewsCSV/reviews.csv');
const reviews = 'reviews';
const createTable = `
DROP TABLE IF EXISTS ${reviews};
CREATE TABLE IF NOT EXISTS ${reviews} (
  review_id SERIAL,
  product_id INTEGER DEFAULT NULL,
  rating INTEGER DEFAULT NULL,
  date BIGINT DEFAULT NULL,
  summary TEXT DEFAULT NULL,
  body TEXT DEFAULT NULL,
  recommend BOOLEAN DEFAULT NULL,
  reported BOOLEAN DEFAULT NULL,
  reviewer_name TEXT DEFAULT NULL,
  reviewer_email TEXT DEFAULT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT NULL
);`;

client.query(createTable).then(() => {
  console.log('Table successfully created!!!');
});

const stream = client.query(copyFrom(`COPY ${reviews} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);
console.time('Execution Time');

fileStream.on('error', (error) => {
  console.log(`Error in reading file: ${error}`);
});
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`);
});
const alterTable = `
ALTER TABLE ${reviews}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS reviews_index;
CREATE INDEX IF NOT EXISTS reviews_index ON ${reviews}(product_id);
`;
stream.on('finish', () => {
  console.log(`Completed loading data into ${reviews}`);
  console.log('Starting table alteration');
  console.time('Alter execution time');
  client.query(alterTable)
    .then(() => {
      console.log('Altered Successfully!');
      console.timeEnd('End Altered execution time!');
      client.end();
    })
    .catch((err) => {
      console.error(err);
    });
});
fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});
module.exports = client;
