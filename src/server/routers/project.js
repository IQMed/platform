const assert = require('assert');
const express =  require('express');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');

const Project = require('../models/project');
const User = require('../models/user');
const Client = require('../models/client');
const logined = require('../logics/ensureLogin');

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
    User.findById(id, 'roles', (err, user) => {
      if (err) return res.json(err);
      return res.jsonp(user.roles);
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
      return res.jsonp(project);
    });
  });

  require('./record')(routes);
  require('./client')(routes);
  
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
      User.findByIdAndUpdate(id, {
        $addToSet: {
          roles: {
            role: "OWNER",
            project: _name
          }
        }
      }, (err) => {
        assert(!err);
      });
      res.jsonp(project);
    });
  });

  // Update Project with the new description
  // usage: PUT desc=
  routes.put('/:project_name', (req, res) => {
    const name = req.params.project_name;
    const desc = req.body.desc;
    assert(typeof name === 'string');
    Project.findOneAndUpdate({name}, {$set: {description: desc}}, err => {
      assert(!err);
      res.jsonp({status: 'ok'});
    });
  });
  
  // Remove Project with given name
  routes.delete('/:project_name', (req, res) => {
    const name = req.params.project_name;
    const {id} = req.user;
    assert(typeof name === 'string');
    assert(id);
    Project.remove({name}, err => {
      assert(!err);
      User.findByIdAndUpdate(id, {$pull: {roles: {project: name}}}, err => {
        assert(!err);
        res.jsonp({status: 'ok'});
      });
    });
  });
  
  // Add a new group to project
  // usage: POST name=
  routes.post('/:project_name/groups?', (req, res) => {
    const projectName = req.params.project_name;
    const {name} = req.body;
    assert(name);
    assert(typeof name === 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName}, {$addToSet: {groups: name}}, (err) => {
      assert(!err);
      res.jsonp({"status": 'ok'});
    });
  });

  // delete group from project
  // usage: DELETE name=
  routes.delete('/:project_name/groups?', (req, res) => {
    const projectName = req.params.project_name;
    const {name} = req.body;
    assert(name);
    assert(typeof name === 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName}, {$pull: {groups: name}}, err => {
      assert(!err);
      res.jsonp({"status": 'ok'});
    });
  });

  // Add a new rule to project
  // usage: POST group=&role=
  routes.post('/:project_name/rules?', (req, res) => {
    const projectName = req.params.project_name;
    const {group, role} = req.body;
    assert(group);
    assert(role);
    assert(typeof group === 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName}, {$push: {rules: {group, role}}}, err => {
      assert(!err);
      res.jsonp({"status": 'ok'});
    });
  });

  // edit rule in a project
  // usage: PUT group=&role=
  routes.put('/:project_name/rules?', (req, res) => {
    const projectName = req.params.project_name;
    const {group, role} = req.body;
    assert(group);
    assert(role);
    assert(typeof group === 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName, 'rules.group': group}, {$set: {'rules.$.role': role}}, err => {
      assert(!err);
      res.jsonp({"status": 'ok'});
    });
  });

  // delete rule from project
  // usage: DELETE group=
  routes.delete('/:project_name/rules?', (req, res) => {
    const projectName = req.params.project_name;
    const {group} = req.body;
    assert(group);
    assert(typeof group === 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName}, {$pull: {rules: {group: group}}}, err => {
      assert(!err);
      res.jsonp({"status": 'ok'});
    });
  });

  // Add a new client to project
  // usage: POST name=
  routes.post('/:project_name/clients?', (req, res) => {
    const projectName = req.params.project_name;
    const {name} = req.body;
    assert(name);
    assert(typeof name == 'string');
    assert(projectName);
    Project.findOneAndUpdate({name: projectName}, {$push: {clients: name}}, err => {
      assert(!err);
      Client.findOneAndUpdate({name}, {$addToSet: {groups: projectName}}, (err, client) => {
        assert(!err);
        if (client)  
          return res.jsonp({"status": 'ok'});
        Client.create({name, groups: [projectName]}, (err,client) => {
          assert(!err);
          assert(client);
          res.jsonp({"status": 'ok'});
        });
      });
    });
  });

  // delete client from project
  // usage: DELETE name=
  routes.delete('/:project_name/clients?', (req, res) => {
    const projectName = req.params.project_name;
    const {name} = req.body;
    assert(name);
    assert(projectName);
    assert(typeof name === 'string');
    Project.findOneAndUpdate({name: projectName}, {$pull: {clients: name}}, err => {
      assert(!err);
      Client.findOneAndUpdate({name}, {$pull: {groups: projectName}}, err => {
        assert(!err);
        res.jsonp({"status": 'ok'});
      });
    });
  });

  app.use('/projects?', routes);
};

module.exports = route;