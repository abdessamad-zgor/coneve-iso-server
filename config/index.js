const firebaseAdmin = require('firebase-admin');

const pathToCert = __dirname + '/coneve-sass-firebase-adminsdk-81z6o-ef63e78fe1.json';

const firebaseConfig = {
  credential: firebaseAdmin.credential.cert(pathToCert),

  apiKey: 'AIzaSyDOZksC7eowYWiaMJxaGt-yQkJWxOc3YHQ',

  authDomain: 'coneve-sass.firebaseapp.com',

  projectId: 'coneve-sass',

  storageBucket: 'coneve-sass.appspot.com',

  messagingSenderId: '357888927272',

  appId: '1:357888927272:web:6ced57737ecca982a5f71d',

  measurementId: 'G-KRTCRHMG5K',
};

const app = firebaseAdmin.initializeApp(firebaseConfig, 'coneve');

module.exports.db = app.firestore();
module.exports.auth = firebaseAdmin.auth(app);
module.exports.storage = firebaseAdmin.storage(app);
