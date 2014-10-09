var async = require('async');
var Item = require('../../orm/node');
var Edge = require('../../orm/edge');

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
      async.eachLimit(tree.nodes, 10, function(node, next){
        var edge = {
          project_id: node.project_id,
          source_id: node.parent_id||node.project_id,
          destination_id: node._id,
          type: 'parent'
        };
        Edge.validate(edge, function(err, edge){
          tree.edges.push(edge);
          next();
        });
      }, function(){
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
      async.eachLimit(tree.nodes, 10, function(node, next){
        var edge = {
          project_id: node.project_id,
          source_id: node.parent_id||node.project_id,
          destination_id: node._id,
          type: 'parent'
        };
        Edge.validate(edge, function(err, edge){
          tree.edges.push(edge);
          next();
        });
      }, function(){
        return reply({
          root: 'tree',
          tree: tree
        });
      });
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
      path: config.route + 'project/{project_id}/tree',
      handler: getTree.bind(store)
    },
    {
      method: 'GET',
      path: config.route + 'project/{project_id}/branch/{id}',
      handler: getBranch.bind(store)
    },
  ]);
  next();
};
