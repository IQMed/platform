const express = require('express');
const User = require('../models/user');

const initApi = app => {
  /* API ROUTES ----------------------------------------------------------------*/
  var apiRoutes = express.Router();

  // route (GET http://localhost:8080/api/)
  apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Welcome to IQMED-PLATFORM!'});
  });

  // route return all users (GET http://localhost:8080/api/users)
  apiRoutes.get('/users', (req, res) => {
    User.find({}, (err, users) => {
      res.json(users);
    });
  });

  // debug only
  apiRoutes.get('/s3tup', (req, res) => {
    var user = new User({
      email: 'nodtem66@gmail.com',
      name: 'Jirawat I',
      password: '123456789'
    });
    user.save( err => {
      if (err) throw err;
      res.json({success: true});
    });
  });

  app.use('/api', apiRoutes);
  /* END API ROUTES ------------------------------------------------------------*/
};

module.exports = initApi;