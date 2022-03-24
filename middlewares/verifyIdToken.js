const { auth } = require('../config');

const verifyIdToken = async (req, res, next) => {
	try {
		let response = await auth.verifyIdToken(req.body.idToken);
		console.log(req.body.idToken);

		if (response.exp > Date.now()) {
			next();
		} else {
			new Error('auth token expired');
		}
	} catch (error) {
		res.status(403).json({ status: 'error', message: 'Not Autherized!' });
	}
};

module.exports = verifyIdToken;
