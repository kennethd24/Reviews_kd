const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api', router);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
