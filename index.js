const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
//import middelwares
const verifyIdTokenMiddleware = require('./middlewares/verifyIdToken');

//import Routes for client

const AuthenticatedProductsRoute = require('./routes/user/products');
const AuthenticatedUsersRoute = require('./routes/user/users');

//import routes for admin
const AdminProductsRoute = require('./routes/admin/products');

//import touter for all
const ProductRoute = require('./routes/products');

// create Express app
const app = express();

//Handle CORS errors
app.use(cors());

//use bodyParser to parse incoming requests

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//Use Helmet to protect againt known vulnerabilities
app.use(helmet());

//Use Morgan to log incoming trafic
app.use(morgan('dev'));

//only routes for admin
app.use('/api/admin', [AdminProductsRoute]);

//routes for authenticated users
app.use('/api/authenticated', verifyIdTokenMiddleware, [AuthenticatedProductsRoute, AuthenticatedUsersRoute]);

//routes for all users
app.use('/api', [ProductRoute]);

module.exports = app;
