const { Pool, Client } = require('pg');
const config = require('../config');

const pool = new Pool(config.postgres);
pool.connect();

const dbHelpers = {
  reviews: {
    getReviews: (req, res) => {
      const productId = req.params.productId || 2;
      const count = req.params.count || 5;
      const page = req.params.page || 1;
      // const sort = req.params.sort || 'relevant';
      const qryStr = `
      SELECT array_to_json(array_agg(row_to_json(t))) AS results
      FROM(
        SELECT product_id, review_id, rating, body, recommend, reviewer_name, reviewer_email, helpfulness,
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT id, url
          FROM reviews_photos
          WHERE reviews_photos.review_id = reviews.review_id
          ORDER BY id ASC
        )x
      ) AS photos
        FROM reviews
        WHERE product_id = ${productId} AND reported = false
        LIMIT ${count}
        OFFSET ${count * (page - 1)}
        )t
      `;
      pool.query(qryStr)
        .then((results) => {
          res.status(200).send(results.rows);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
    updateHelpfulReview: (req, res) => {
      const { reviewId } = req.params;
      const qryStr = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${reviewId}`;
      pool.query(qryStr)
        .then(() => {
          res.status(200).send('Successful updateHelpfulReview');
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
    reportReview: (req, res) => {
      const { reviewId } = req.params;
      const qryStr = `UPDATE reviews SET reported = true where id = ${reviewId}`;
      pool.query(qryStr)
        .then(() => {
          res.status(200).send('Successful reportReview');
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
  },
};

module.exports = dbHelpers;
