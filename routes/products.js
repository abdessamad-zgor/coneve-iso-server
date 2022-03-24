const express = require('express');

const { db } = require('../config/index');

const router = new express.Router();

//Get an index for all products
router.get('/products/index', async (req, res) => {
	try {
		let snapshot = await db.collection('index').doc('products').get();
		if (snapshot.exists) {
			res.status(200).json({ ...snapshot.data() });
		}
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
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
			throw new Error('Product does not exist!');
		}
	} catch (err) {
		console.error(err);
		res.status(404).json(err);
	}
});

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
