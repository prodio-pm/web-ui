var Node = require('../../orm/node');
var Edge = require('../../orm/edge');

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
    Edge.validate(payload, function(err, edge){
      if(err){
        return callback(err);
      }
      return callback(null, edge);
    });
  });
};

var getEdges = function(req, reply){
  var self = this;
  self.get(req.params.node_id, function(err, node){
    if(err){
      return reply(err);
    }
    var options = {
        filter: {
          _type: 'edge',
          $or: [
            {
              source_id: req.params.node_id
            },
            {
              destination_id: req.params.node_id
            }
          ]
        },
        offset: 0
      };
    self.asArray(options, function(err, edges){
      if(err){
        return reply(err);
      }
      node = node[node.root];
      Edge.validate({
        project_id: node.project_id,
        source_id: node.parent_id||node.project_id,
        destination_id: node._id,
        type: 'parent'
      }, function(err, rootEdge){
        if(err){
          return reply({
            root: 'errors',
            'errors': err
          });
        }
        edges[edges.root].unshift(rootEdge);
        edges.length++;
        edges.count++;
        edges.limit++;
        return reply(edges);
      });
    });
  });
};

var getEdge = function(req, reply){
  var self = this;
  self.get(req.params.edge_id, function(err, node){
    return reply(err||node);
  });
};

var createEdge = function(req, reply){
  var self = this;
  validatePayload(self, req.params.project_id, req.payload, function(err, edge){
    self.insert(edge, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply(edge.root?edge:{
        root: 'edge',
        edge: edge
      });
    });
  });
};

var updateEdge = function(req, reply){
  var self = this;
  validatePayload(self, req.params.project_id, req.payload, function(err, edge){
    if(err){
      return reply(err);
    }
    self.update(req.params.edge_id, edge, function(err, record){
      if(err){
        return reply({
          root: 'error',
          error: err
        });
      }
      return reply(record.root?record:{
        root: 'edge',
        edge: record
      });
    });
  });
};

var deleteEdge = function(req, reply){
  var self = this;
  self.delete(req.params.edge_id, function(err, deleted){
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

module.exports= function(options, next){
  var config = options.config;
  var server = options.hapi;
  var store = options.stores(config.collectionName||'items');

  server.route([
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/node/{node_id}/edges',
      handler: getEdges.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/node/{node_id}/edge',
      handler: getEdge.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project/{project_id}/node/{node_id}/edge',
      handler: createEdge.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project/{project_id}/node/{node_id}/edge',
      handler: createEdge.bind(store)
    },
    {
      method: 'POST',
      path: config.route + 'project/{project_id}/node/{node_id}/edge/{edge_id}',
      handler: updateEdge.bind(store)
    },
    {
      method: 'PUT',
      path: config.route + 'project/{project_id}/node/{node_id}/edge/{edge_id}',
      handler: updateEdge.bind(store)
    },
    {
      method: 'DELETE',
      path: config.route + 'project/{project_id}/node/{node_id}/edge/{edge_id}',
      handler: deleteEdge.bind(store)
    },
  ]);
  next();
};
