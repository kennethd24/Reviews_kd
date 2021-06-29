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
        .then((resultsQuery) => {
          const reviewsObj = {};
          reviewsObj.product = productId;
          reviewsObj.page = page;
          reviewsObj.count = count;
          reviewsObj.results = resultsQuery.rows;
          res.status(200).json(reviewsObj);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    },
    getMetadata: (req, res) => {
      const { productId } = req.params;
      const qryStr = `
      SELECT row_to_json(t) as queryResults
      FROM (
        select product_id,
        (
          SELECT json_object_agg(rating, sumRatings) as ratings
          FROM (
            SELECT rating,
              COUNT(*) AS sumRatings
                FROM reviews
                WHERE product_id = ${productId} AND reviews.reported = false
                GROUP BY rating
                ORDER BY rating ASC
          )x
        ),
        (
          SELECT json_object_agg(recommend, counts) as recommended
          FROM (
            SELECT recommend,
              COUNT(*) as counts
              FROM reviews
              WHERE product_id = ${productId} AND reviews.reported = false
              GROUP BY recommend
              ORDER BY recommend ASC
          )u
        ),
        (
          SELECT json_object_agg(name, charDetails) AS characteristics
          FROM (
            SELECT name
            , json_build_object(
          'id', characteristics.id, 'value', AVG(value)::NUMERIC(10,4)) AS charDetails
          FROM characteristic_reviews
          INNER JOIN characteristics ON characteristics.id = characteristic_id
          WHERE product_id = ${productId}
          GROUP BY characteristics.id, characteristics.name
          ORDER BY characteristics.id
          )v
        )
        FROM characteristics
        WHERE product_id = ${productId}
        GROUP BY product_id
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
    postReview: (req, res) => {
      const {
        productId,
        rating,
        summary,
        body,
        recommend,
        name,
        email,
        photos, // array of strings
        characteristics, // object of key id and value integer
      } = req.body;
      const timestamp = (new Date()).toISOString();
      const qryStr = `
      with newReview as (
        insert into reviews
          (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date, helpfulness, reported)
        values
          (${productId}, ${rating}, "${summary}", "${body}", ${recommend}, "${name}", "${email}", ${timestamp}, 0, false)
        returning id
      )
      insert into reviews_photos
      (review_id, url)
      SELECT (select * from newReview) review_id, x
      FROM  unnest(ARRAY${photos}) x
      `;
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
