var Item = require('../../orm/item');

var validatePayload = function validatePayload(store, project_id, payload, callback){
  if((!payload)||(typeof(payload)!=='object')){
    return callback({
      root: 'error',
      error: 'Must supply a payload!'
    });
  }
  payload.project_id = project_id;
  store.get(project_id, function(err, project){
    if(err){
      return callback({
        root: 'error',
        error: err
      });
    }
    if(!project[project.root]){
      return callback({
        root: 'error',
        error: 'Could not locate a project with id of '+project_id+'!'
      });
    }
    if(project[project.root].type!=='project'){
      return callback({
        root: 'error',
        error: 'Could not locate a project with id of '+project_id+'!'
      });
    }
    Item.validate(payload, function(err, item){
      if(err){
        return callback(err);
      }
      return callback(null, item);
    });
  });
};

var listRecords = function listRecords(req, reply){
  var self = this;
  var options = req.query||{};
  options.filter = options.filter || {};
  options.filter.project_id = req.params.project_id;
  if(req.query.q){
    var re = new RegExp(req.query.q, 'i');
    options.filter.$or = [
      {
        name: re
      },
      {
        description: re
      },
      {
        version: re
      }
    ];
  }
  self.asArray(options, function(err, records){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    return reply(records);
  });
};

var getTree = function listRecords(req, reply){
  var self = this;
  var options = req.query||{};
  options.filter = options.filter || {};
  options.filter.project_id = req.params.project_id;
  self.get(req.params.project_id, function(err, record){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    self.asArray(options, function(err, records){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      var tree = {
        root: record[record.root],
        nodes: records[records.root],
        edges: []
      };
      tree.nodes.forEach(function(node){
        tree.edges.push({from: node.parent_id, to: node._id});
      });
      return reply({
        root: 'tree',
        tree: tree,
        length: records.length,
        offset: records.offset,
        count: records.count,
        limit: records.limit
      });
    });
  });
};

var getBranch = function(req, reply){
  var self = this;
  var options = req.query||{};
  options.filter = options.filter || {};
  options.filter.project_id = req.params.project_id;
  options.filter.parent_id = req.params.id;
  self.get(req.params.id, function(err, record){
    if(err){
      return reply({
        root: 'error',
        error: err
      });
    }
    self.asArray(options, function(err, records){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      var tree = {
        root: record[record.root],
        nodes: records[records.root],
        edges: [],
        criteria: {
          length: records.length,
          offset: records.offset,
          count: records.count,
          limit: records.limit
        }
      };
      tree.nodes.forEach(function(node){
        tree.edges.push({from: node.parent_id, to: node._id});
      });
      return reply({
        root: 'tree',
        tree: tree
      });
    });
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
    return reply(record.root?record:{
      root: 'record',
      record: record
    });
  });
};

var createRecord = function createRecord(req, reply){
  var self = this;
  validatePayload(self, req.params.project_id, req.payload, function(err, details){
    if(err){
      return reply(err);
    }
    self.insert(details, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply(record.root?record:{
        root: 'record',
        record: record
      });
    });
  });
};

var updateRecord = function updateRecord(req, reply){
  var self = this;
  validatePayload(self, req.params.project_id, req.payload, function(err, details){
    if(err){
      return reply(err);
    }
    self.update(req.params.id, details, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply(record.root?record:{
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
      path: config.route + 'project/{project_id}/items',
      handler: listRecords.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/item/{id}',
      handler: getRecord.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project/{project_id}/item',
      handler: createRecord.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project/{project_id}/item',
      handler: createRecord.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project/{project_id}/item/{id}',
      handler: updateRecord.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project/{project_id}/item/{id}',
      handler: updateRecord.bind(store)
    },
    {
      method: 'DELETE',
      path: config.route + 'project/{project_id}/item/{id}',
      handler: deleteRecord.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/tree',
      handler: getTree.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/branch/{id}',
      handler: getBranch.bind(store)
    }
  ]);
  next();
};
