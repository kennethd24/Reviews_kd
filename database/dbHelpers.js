const pgp = require('pg-promise')();
const pool = require('./index');

const dbHelpers = {
  reviews: {
    getReviews: async (req, res) => {
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
        WHERE product_id = $1 AND reported = false
        ORDER BY date DESC
        LIMIT $2
        OFFSET $3
      `;
      try {
        const offsetPage = (count * (page - 1));
        const { rows } = await pool.query(qryStr, [productId, count, offsetPage]);
        const reviewsObj = {};
        reviewsObj.product = productId;
        reviewsObj.page = page;
        reviewsObj.count = count;
        reviewsObj.results = rows;
        res.status(200).json(reviewsObj);
      } catch (err) {
        res.status(400).send(err);
      }
    },
    getMetadata: async (req, res) => {
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
                WHERE product_id = $1 AND reviews.reported = false
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
              WHERE product_id = $1 AND reviews.reported = false
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
          WHERE product_id = $1
          GROUP BY characteristics.id, characteristics.name
          ORDER BY characteristics.id
          )v
        )
        FROM characteristics
        WHERE product_id = $1
        GROUP BY product_id
      )t
      `;
      try {
        const { rows } = await pool.query(qryStr, [productId]);
        res.status(200).send(rows[0].queryresults);
      } catch (err) {
        res.status(400).send(err);
      }
    },
    postReview: async (req, res) => {
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
      const qryStr = `
      WITH newReview AS (
        INSERT INTO reviews
        (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date)
        VALUES
        ($1 , $2, $3, $4, $5, $6, $7, current_timestamp)
        returning id
        ), charArr AS (
        SELECT (select * from newReview) AS review_id,
          d.key::text::int AS characteristic_id,
          d.value::text::int AS value
          FROM json_each($8::json)d
        ), setupChar as (
          INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
          SELECT * FROM charArr
          )
          insert into reviews_photos
          (review_id, url)
          SELECT (select * from newReview) review_id, x
          FROM  unnest(array[$9]) x
          `;
      try {
        await pool.query(qryStr,
          [productId, rating, summary, body, recommend, name, email, characteristics, photos]);
        res.status(200).send('Successful postReview');
      } catch (err) {
        res.status(400).send(err);
      }
    },
    updateHelpfulReview: async (req, res) => {
      const { reviewId } = req.params;
      const qryStr = 'UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1';
      try {
        await pool.query(qryStr, [reviewId]);
        res.status(200).send('Successful updateHelpful');
      } catch (err) {
        res.status(400).send(err);
      }
    },
    reportReview: async (req, res) => {
      const { reviewId } = req.params;
      const qryStr = 'UPDATE reviews SET reported = true where id = $1';
      try {
        await pool.query(qryStr, [reviewId]);
        res.status(200).send('sucessful reported!');
      } catch (err) {
        res.status(400).send(err);
      }
    },
  },
};

module.exports = dbHelpers;
