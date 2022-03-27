const { auth } = require('../config');

const verifyIdToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    let response = await auth.verifyIdToken(idToken);

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ status: 'error', message: 'Not Autherized!' });
  }
};

module.exports = verifyIdToken;
