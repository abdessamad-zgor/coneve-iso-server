const express = require('express');

const { db } = require('../../config');

const router = new express.Router();

//Get all id's in products collection
router.get('/ids', async (req, res) => {
  const indexRef = db.collection('index').doc('products');

  indexRef
    .get()
    .then((doc) => {
      let ids = [];
      Object.keys(doc.data().all).forEach((key) => ids.push(key));
      res.status(200).json(ids);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

//Get a product
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection('products').doc(id);
    const snapshot = await productRef.get();

    if (snapshot.exists) {
      const reviewsSnap = await productRef.collection('reviews').get();
      let reviews = [];
      reviewsSnap.docs.forEach((doc) => {
        reviews.push({ id: doc.id, reviews: doc.data() });
      });
      res.status(200).json({ productInView: { id: snapshot.id, ...snapshot.data() }, reviews });
    } else {
      res.status(600);
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//create a new product
router.post('/products', async (req, res) => {
  try {
    const newProduct = await db.collection('products').doc().set(req.body);

    res.status(200);
    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//update a product
router.put('/products/:id', async (req, res) => {
  try {
    const response = await db.collection('products').doc(req.params.id).set(req.body, { merge: true });
    res.status(200);
    res.json({
      status: 'sucess',
      writtenAt: response.writeTime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
