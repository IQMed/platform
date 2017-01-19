const assert = require('assert');
const express =  require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongoose').Types.ObjectId;
//const MongoClient = require('mongodb').MongoClient;
const randomstring = require('randomstring');

const Project = require('../models/project');
const User = require('../models/user');
const logined = require('../logics/ensureLogin');
const jsonp = require('../utils').jsonp;

const route = app => {  
  app.get('/:project_name/clients?', (req, res) => {
    res.json(req.params);
  });
};

module.exports = route;