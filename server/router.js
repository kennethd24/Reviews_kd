const router = require('express').Router();
const dbHelpers = require('../database/dbHelpers');

// POST /reviews
router.post('/reviews', dbHelpers.reviews.postReview);

// GET /reviews/
router.get('/reviews/:productId?/:count?/:page?/', dbHelpers.reviews.getReviews);

// GET /reviews/meta
router.get('/reviews2/meta/:productId', dbHelpers.reviews.getMetadata);

// PUT /reviews/:review_id/helpful
router.put('/reviews/:reviewId/helpful', dbHelpers.reviews.updateHelpfulReview);

// PUT /reviews/:review_id/report
router.put('/reviews/:reviewId/report', dbHelpers.reviews.reportReview);

module.exports = router;
