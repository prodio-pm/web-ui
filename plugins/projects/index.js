var semver = require('semver');
var Project = require('../../orm/project');

var validatePayload = function validatePayload(payload, callback){
  if((!payload)||(typeof(payload)!=='object')){
    return callback({
      root: 'error',
      error: 'Must supply a payload!'
    });
  }
  Project.validate(payload, function(err, project){
    if(err){
      return callback(err);
    }
    project.type='project';
    return callback(null, project);
  });
};

var listRecords = function listRecords(req, reply){
  var self = this;
  req.query.filter = req.query.filter || {};
  req.query.filter.type='project';
  if(req.query.q){
    var re = new RegExp(req.query.q, 'i');
    req.query.filter.$or = [
      {
        name: re
      },
      {
        description: re
      }
    ];
  }
  self.asArray(req.query, function(err, records){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    return reply(records);
  });
};

var getRecord = function getRecord(req, reply){
  var self = this;
  self.get(req.params.id, function(err, record){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    if(!record[record.root]){
      return reply({
        root: 'error',
        error: 'No record with id '+req.params.id+' found!'
      });
    }
    return reply(record);
  });
};

var createRecord = function createRecord(req, reply){
  var self = this;
  validatePayload(req.payload, function(err, payload){
    if(err){
      return reply(err);
    }
    self.insert(payload, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply({
        root: 'record',
        record: record
      });
    });
  });
};

var updateRecord = function updateRecord(req, reply){
  var self = this;
  validatePayload(req.payload, function(err, payload){
    if(err){
      return reply(err);
    }
    self.update(req.params.id, payload, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply({
        root: 'record',
        record: record
      });
    });
  });
};

var deleteRecord = function deleteRecord(req, reply){
  var self = this;
  self.delete(req.params.id, function(err, deleted){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    return reply({
      root: 'deleted',
      deleted: deleted
    });
  });
};

module.exports = function(options, next){
  var config = options.config;
  var server = options.hapi;
  var store = options.stores(config.collectionName||'items');

  server.route([
    {
      method: 'GET',
      path: config.route + 'projects',
      handler: listRecords.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{id}',
      handler: getRecord.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project',
      handler: createRecord.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project',
      handler: createRecord.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project/{id}',
      handler: updateRecord.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project/{id}',
      handler: updateRecord.bind(store)
    },
    {
      method: 'DELETE',
      path: config.route + 'project/{id}',
      handler: deleteRecord.bind(store)
    },
  ]);
  next();
};
