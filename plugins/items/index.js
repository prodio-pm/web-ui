var validatePayload = function validatePayload(store, project_id, payload, callback){
  if((!payload)||(typeof(payload)!=='object')){
    return callback({
      root: 'error',
      error: 'Must supply a payload!'
    });
  }
  if(!payload.name){
    return callback({
      root: 'error',
      error: 'Must supply a name!'
    });
  }
  if(!payload.type){
    return callback({
      root: 'error',
      error: 'Must supply a type!'
    });
  }
  payload.project_id = project_id;
  payload.parent_id = payload.parent_id || payload.project_id;
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
    callback(null, {project: project[project.root], payload: payload});
  });
};

var listRecords = function listRecords(req, reply){
  var self = this;
  var options = req.query||{};
  options.filter = options.filter || {};
  options.filter.project_id = req.params.project_id;
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
      records[records.root].unshift(record[record.root]);
      return reply(records);
    });
  });
};

var getBranch = function(req, reply){
  reply({
    root: 'error',
    error: 'Not implemented!'
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
    return reply({
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
    self.insert(details.payload, function(err, record){
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
  validatePayload(self, req.params.project_id, req.payload, function(err, details){
    if(err){
      return reply(err);
    }
    self.update(req.params.id, details.payload, function(err, record){
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
    }
  ]);
  next();
};
