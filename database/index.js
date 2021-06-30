const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.postgres);

pool.connect((err) => (
  // eslint-disable-next-line no-console
  err ? console.error(err) : console.log('PostgreSQL Database Connected')
));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
