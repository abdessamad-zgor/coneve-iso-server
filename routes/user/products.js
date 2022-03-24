const express = require('express');

const { db } = require('../../config');

const router = new express.Router();

//add a review to a product
router.post('/products/:id/reviews', async (req, res) => {
  try {
    let response = await db.collection('products').doc(req.params.id).collection('reviews').add(req.body);
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
