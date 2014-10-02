var semver = require('semver');

var validatePayload = function validatePayload(payload, callback){
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
  payload.version = payload.version || '0.0.1';
  if(!semver.valid(payload.version)){
    return callback({
      root: 'error',
      error: 'Invalid version specified "'+payload.version+'", must be a valid semver!'
    });
  }
  payload.type = 'project';
  callback(null, payload);
};

var listRecords = function listRecords(req, reply){
  var self = this;
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
