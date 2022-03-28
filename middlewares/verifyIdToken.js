const { auth } = require('../config');
const axios = require('axios');

const verifyIdToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.headers.authorization.split(' ')[2];
    let response = await auth.verifyIdToken(idToken);

    let resProxy = await axios({
      url: `https://securetoken.googleapis.com/v1/token?key=${process.env.API_KEY}`,
      method: 'POST',
      data: `refreshToken=${refreshToken}&grant_type=refresh_token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded ',
      },
    });
    res.locals.newIdToken = resProxy.data.id_token;
    res.locals.newRefreshToken = resProxy.data.refresh_token;

    next();
  } catch (e) {
    if (e.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(e.response.data);
      console.log(e.response.status);
      console.log(e.response.headers);
      res.status(500).json({ status: 'error', error: e.response });
    } else if (e.request) {
      // The request was made but no response was received
      // `e.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(e.request);
      res.status(500).json({ status: 'error', error: e.request });
    } else {
      console.log('Error', e.message);
      res.status(500).json({ status: 'error', error: e.message });
    }
  }
};

module.exports = verifyIdToken;
