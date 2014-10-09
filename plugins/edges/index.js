var Node = require('../../orm/node');
var Edge = require('../../orm/edge');

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
  ]);
  next();
};
