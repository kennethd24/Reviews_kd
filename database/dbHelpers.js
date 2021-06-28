const pool = require('./index');

const dbHelpers = {
  reviews: {
    getReviews: (req, res) => {
      const productId = req.params.productId || 2;
      const count = req.params.count || 5;
      const page = req.params.page || 1;
      // const sort = req.params.sort || 'relevant';
      const qryStr = `
        SELECT product_id, id, rating, body, date, recommend, reviewer_name, reviewer_email, helpfulness,
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (
          SELECT id, url
          FROM reviews_photos
          WHERE reviews_photos.review_id = reviews.id
          ORDER BY id ASC
        )x
      ) AS photos
        FROM reviews
        WHERE product_id = ${productId} AND reported = false
        ORDER BY date DESC
        LIMIT ${count}
        OFFSET ${count * (page - 1)}
      `;
      pool.query(qryStr)
        .then((results1) => {
          const reviewsObj = {};
          reviewsObj.product = productId;
          reviewsObj.page = page;
          reviewsObj.count = count;
          reviewsObj.results = results1.rows;
          res.status(200).json(reviewsObj);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
    getMetadata: (req, res) => {
      const { productId } = req.params;
      const qryStr = '';
      pool.query(qryStr)
        .then((results) => {
          const metaDataObj = {};
          metaDataObj.product_id = productId;
          metaDataObj.ratings = placeholder;
          metaDataObj.recommended = placeholder;
          metaDataObj.characteristics = placeholder;
          res.status(200).json(metaDataObj);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
    postReview: (req, res) => {
      const {
        productId,
        rating,
        summary,
        body,
        recommend,
        name,
        email,
        photos,
        characteristics,
      } = req.body;
      pool.query(qryStr)
        .then(() => {
          res.status(200).send('Successful postReview');
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
