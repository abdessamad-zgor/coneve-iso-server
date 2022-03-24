const express = require('express');
const { db } = require('../../config');

let router = new express.Router();

//get current user info
router.get('/users/:uid', async (req, res) => {
	try {
		let uid = req.params.uid;
		let response = await db.collection('users').doc(uid).get();
		if (response.exists) {
			res.status(200).json({ ...response.data(), uid });
		} else {
			throw new Error('user does not exist!');
		}
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
});

//get current user address
router.get('/users/:uid/address', async (req, res) => {
	try {
		let uid = req.params.uid;
		let response = await db.collection('users').doc(uid).collection('privateInfo').doc('address').get();
		if (response.exists) {
			res.status(200).json({ ...response.data() });
		} else {
			throw new Error('address does not exist!');
		}
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
});

//create new user info document
router.post('/users/:uid', async (req, res) => {
	try {
		let uid = req.params.uid;
		await db
			.collection('users')
			.doc(uid)
			.set({ email: req.body.email, phone: req.body.phone, fullName: req.body.fullName });
		res.status(200).json({ status: 'success' });
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
});

//add new order
router.post('/users/:uid/orders', async (req, res) => {
	try {
		let uid = req.params.uid;
		await db.collection('users').doc(uid).collection('orders').add(req.body);
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
});

//get current user orders
router.get('/users/:uid/orders', async (req, res) => {
	try {
		let uid = req.params.uid;
		let snapshot = await db.collection('users').doc(uid).collection('orders').get();
		if (snapshot.empty) {
			throw new Error('No orders found.');
		}
		let orders = [];
		snapshot.docs.forEach((doc) => orders.push(doc.data()));
		res.status(200).json({ status: 'sucess', orders });
	} catch (e) {
		res.status(500).json({ status: 'error', message: e.message });
	}
});

//get current user coupons
router.get('/users/:uid/coupons', async (req, res) => {
	try {
		let uid = req.params.uid;
		let snapshot = await db.collection('users').doc(uid).collection('coupons').get();
		if (snapshot.empty) {
			throw new Error('No coupons found.');
		}
		let coupons = [];
		snapshot.docs.forEach((doc) => coupons.push(doc.data()));
		res.status(200).json({ status: 'sucess', coupons });
	} catch (e) {
		res.status(200).json({ status: 'error', message: e.message });
	}
});
module.exports = router;
