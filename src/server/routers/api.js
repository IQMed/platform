const express = require('express');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const passport = require('passport');

const Account = require('../models/account');

const initApi = app => {
  /* API ROUTES ----------------------------------------------------------------*/
  var apiRoutes = express.Router();

  // route (GET http://localhost:8080/api/)
  apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Welcome to IQMED-PLATFORM!'});
  });

  // route return all users (GET http://localhost:8080/api/users)
  apiRoutes.get('/users', (req, res) => {
    Account.find({}, (err, users) => {
      res.json(users);
    });
  });

  // debug only
  apiRoutes.get('/setup', (req, res) => {
    var user = new Account({
      email: 'nodtem66@gmail.com',
      name: 'Jirawat I',
      password: '123456789'
    });
    user.save( err => {
      if (err) throw err;
      console.log('User saved successfully');
      res.json({success: true});
    });
  });

  apiRoutes.post('/login', (req, res) => {
    var email, password;
    const noExpire = (req.body.noExpire === 'true') || false;

    if (req.body.email && req.body.password) {
      email = req.body.email;
      password = req.body.password;
    } else {
      return res.status(401).json({message: 'invalid parameters'});
    }

    Account.findOne({email}, (err, account) => {
      if (err) 
        return res.status(401).json({message: 'internal server error', err});
      if (account)
        account.verifyPassword(password, (err, valid) => {
          if (err)
            return res.status(401).json({message: 'internal server error', err});
          if (valid) {
            /*
            const authId = uuid();
            var session = new Session({email: account.email, authId});
            session.save( err => {
              if (err) throw err;
              const payload = {sub: account.email, name: account.name};
              let options = {jwtid: authId};
              if (! noExpire ) options['expiresIn'] = '3h';
              const token = jwt.sign(payload, app.get('superSecret'), options);
              return res.json({message: "ok", token, email: account.email, name: account.name});
            });
            */
          } else {
            return res.status(401).json({message: 'authentication fail'});
          }
        });
      else return res.status(401).json({message: 'authentication fail'});
    });
  });

  app.use('/api', apiRoutes);
  /* END API ROUTES ------------------------------------------------------------*/
};

module.exports = initApi;