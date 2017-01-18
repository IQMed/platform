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
  var routes = express.Router();

  routes.use(bodyParser.urlencoded({extended: false}));
  routes.use(bodyParser.json());
  routes.use(logined);
  
  // List Projects
  routes.get('/', (req, res) => {
    req.accepts(['text', 'json']);
    const {id} = req.user;
    assert(id);
    User.findOne({_id: ObjectId(id)}, 'roles', (err, user) => {
      if (err) return res.json(err);
      if (req.query.callback) return res.send(jsonp(req.query.callback, user.roles));
      return res.json(user.roles);
    });
  });
  
  // Get Project with a name
  routes.get('/:project_name', (req, res) => {
    req.accepts(['text', 'json']);
    const name = req.params.project_name;
    assert(typeof name === 'string');
    Project.findOne({name}, (err, project) => {
      if (err) return res.json({error: err});
      if (!project) return res.json({error: 'not found'});
      if (req.query.callback) return res.send(jsonp(req.query.callback, project));
      return res.json(project);
    });
  });
  
  // Create Project with the name and description
  // usage: POST name=&desc=
  routes.post('/', (req, res) => {
    const {id} = req.user;
    const {name, desc} = req.body;
    assert(typeof name === 'string');
    const _name = name.replace(/\W+/g, '_').replace(/\_{2,}/g, '_');
    const dbName = _name + '_' + randomstring.generate(7);

    let project = new Project({
      dbName,
      name: _name,
      description: desc,
      groups: ["OWNER", "MEMBER", "DEVICE", "PUBLIC"],
      rules: [
        {group: "OWNER", role: "777"},
        {group: "MEMBER", role: "477"},
        {group: "DEVICE", role: "464"}
      ]
    });
    project.save((err, project) => {
      assert(!err);
      User.findOneAndUpdate({_id: ObjectId(id)}, {
        $push: {
          roles: {
            role: "OWNER",
            project: _name
          }
        }
      }, (err) => {
        assert(!err);
      });
      res.json(project);
    });
  });

  // Update Project with the new description
  routes.put('/:project_name', (req, res) => {
    const name = req.params.project_name;
    const desc = req.body.desc;
    assert(typeof name === 'string');
    Project.findOneAndUpdate({name}, {$set: {description: desc}}, err => {
      assert(!err);
      res.json({status: 'ok'});
    });
  });
  
  // Remove Project with given name
  routes.delete('/:project_name', (req, res) => {
    const name = req.params.project_name;
    assert(typeof name === 'string');
    Project.remove({name}, err => {
      assert(!err);
      res.json({status: 'ok'});
    });
  });
  app.use('/projects?', routes);
};

module.exports = route;