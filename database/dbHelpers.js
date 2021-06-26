const { Pool, Client } = require('pg');
const config = require('../config');

const pool = new Pool(config.postgres);

const dbHelpers = {
  reviews: {
    getReviews: (req, res) => {
      const {
        productId,
        count,
        // page =  1,
        // sort = 'relevant',
      } = req.params;
      const qryStr = `
      SELECT array_to_json(array_agg(row_to_json(t))) AS results
      FROM(
        SELECT product_id, reviews.review_id rating, body, recommend, reviewer_name, reviewer_email, helpfulness,
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
        WHERE product_id = 2 AND reported = false
        )t
      `;

      // const qryStr = `SELECT review_id, JSON_OBJECT_AGG("url", r2_url) as Photos from

      // (
      // SELECT r1.review_id
      // , 'url' as url
      // , case when r2.url is null then '' else r2.url end as r2_url
      // FROM reviews r1
      // LEFT JOIN reviews_photos r2 ON r1.review_id = r2.review_id
      // WHERE product_id = 2
      //   )x

      // group by 1`;

      // const qryStr = `SELECT r1.review_id, JSON_OBJECT_AGG("url",r2.url) as Photos FROM reviews r1 LEFT JOIN reviews_photos r2 ON r1.review_id = r2.review_id  WHERE product_id = 2 GROUP BY 1 LIMIT 5`;

      // const qryStr = `SELECT r1.review_id, ARRAY_AGG(r2.id, r2.url) as Photos FROM reviews r1 LEFT JOIN reviews_photos r2 ON r1.review_id = r2.review_id  WHERE product_id = ${productId} LIMIT ${count}`;
      // const qryStr = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, reviews_photos.id, reviews_photos.url FROM reviews r1 LEFT JOIN reviews_photos r2 ON r1.review_id = r2.review_id  WHERE product_id = ${productId} LIMIT ${count}`;

      // const qryStr = `SELECT id, url from reviews_photos WHERE product_id  = ${productId} LIMIT ${count}`;
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
      const qryStr = `UPDATE reviews SET reported = NOT reported where id = ${reviewId}`;
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
