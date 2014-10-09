var MindMap = require('../../charts/mindmap.js');
var applyChartConfiguration = require('../../../lib/charts').applyChartConfiguration;
var Loader = require('../../../lib/loader');
var support = require('../../../lib/support');
var el = support.el;

var MindMapController = function(container, data){
  var self = this;
  self.project_id = data.root._id;
  self.container = container;
  self.chart = MindMap();
  applyChartConfiguration('mm', container, self.chart, ['width', 'height', 'identity', 'duration', 'style']);
  if(!data){
    try{
      var src = container.innerText;
      if(src){
        var f = new Function('return '+src+';');
        data = f();
      }
      container.innerHTML = '';
    }catch(e){
      console.log(e);
    }
  }
  self.bindEvents(container);
  if(data){
    self.update(data, support.paramByName('focus'));
  }
  self.dataAttributePrefix = 'mm';
};

MindMapController.prototype.select = function(node){
  // Find previously selected, unselect
  d3.select(".selected").classed("selected", false);
  // Select current item
  d3.select(node).classed("selected", true);
};

MindMapController.prototype.selectNode = function(target){
  var self = this;
  if(target){
    var sel = d3.select(self.container).selectAll('.node');
    sel = sel.filter(function(d){return d._id==(target._id||target)});
    sel = (sel[0]||[])[0];
    if(sel){
      self.select(sel);
    }
  }
};

MindMapController.prototype.bindEvents = function(container){
  var self = this;
  var getDirection = function(data){
    if(!data){
      return 'root';
    }
    if(data.position){
      return data.position;
    }
    return getDirection(data.parent);
  };

  var update = function(node){
    var id = node._id;
    self.chart.update(node);
    setTimeout(function(){
      self.selectNode(id);
    }, self.chart.duration()+100);
  };

  self.chart.click(function(d){
    self.select(this);
  });
  Mousetrap.bind('left', function(){
    // left key pressed
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      var dir = getDirection(data);
      switch(dir){
        case('right'):
        case('root'):
          self.selectNode(data.parent || data.left[0]);
          break;
        case('left'):
          self.selectNode((data.children||[])[0]);
          break;
        default:
          break;
      }
    }
    return false;
  });
  Mousetrap.bind('right', function(){
    // right key pressed
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      var dir = getDirection(data);
      switch(dir){
        case('left'):
        case('root'):
          self.selectNode(data.parent || data.right[0]);
          break;
        case('right'):
          self.selectNode((data.children||[])[0]);
          break;
        default:
          break;
      }
    }
    return false;
  });
  Mousetrap.bind('up', function(){
    // up key pressed
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      var dir = getDirection(data);
      switch(dir){
        case('root'):
          break;
        case('left'):
        case('right'):
          var p = data.parent, nl = p.children || [], i=1;
          if(p[dir]){
            nl = p[dir];
          }
          l = nl.length;
          for(; i<l; i++){
            if(nl[i]._id === data._id){
              self.selectNode(nl[i-1]);
              break;
            }
          }
          break;
      }
    }
    return false;
  });
  Mousetrap.bind('down', function(){
    // down key pressed
    // up key pressed
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      var dir = getDirection(data);
      switch(dir){
        case('root'):
          break;
        case('left'):
        case('right'):
          var p = data.parent, nl = p.children || [], i=0;
          if(p[dir]){
            nl = p[dir];
          }
          l = nl.length;
          for(; i<l-1; i++){
            if(nl[i]._id === data._id){
              self.selectNode(nl[i+1]);
              break;
            }
          }
          break;
      }
    }
    return false;
  });

  Mousetrap.bind('ins', function(){
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      self.unbindEvents();
      var data = selection.__data__;
      var dir = getDirection(data);
      var name = alertify.prompt('New name', function(insert, name){
        if(insert && name){
          if(dir==='root'){
            dir = data.right.length>data.left.length?'left':'right';
          }
          var cl = data[dir] || data.children || data._children;
          if(!cl){
            cl = data.children = [];
          }

          return Loader.post('/api/v1/project/'+self.project_id+'/node',
            {
              data: {
                parent_id: data._id,
                name: name,
                type: 'unknown'
              }
            },
            function(err, rec){
              self.bindEvents();
              if(err){
                return alertify.error(err.error||err);
              }
              cl.push({
                name: rec.name,
                position: rec.dir,
                _id: rec._id,
                description: rec.description,
                rec: rec
              });
              return update(data);
            });
        }
        if(insert && !name){
          alertify.error('Must supply a valid name!');
        }
        self.bindEvents();
      });
    }
  });

  Mousetrap.bind('del', function(){
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      var dir = getDirection(data);
      var root = data.parent;
      if(dir==='root'){
        alert('Can\'t delete root');
        return;
      }
      var cl = data.parent[dir] || data.parent.children;
      if(!cl){
        alert('Could not locate children');
        return;
      }
      var i = 0, l = cl.length;
      for(; i<l; i++){
        if(cl[i]._id === data._id){
          self.unbindEvents();
          alertify.confirm('Sure you want to delete '+data.name+'?', function(remove){
            if(remove){
              return Loader.delete('/api/v1/project/'+self.project_id+'/node/'+data._id, function(err, deleted){
                self.bindEvents();
                if(err){
                  return alertify.error(err.error||err);
                }
                cl.splice(i, 1);
                update(root);
              });
            }
            self.bindEvents();
          });
          break;
        }
      }
    }
  });

  var editNodeName = function(){
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      self.unbindEvents();
      var data = selection.__data__;
      var name = alertify.prompt('New text:', function(accepted, name){
        self.bindEvents();
        if(!accepted){
          return;
        }
        if(name !== data.name){
          var rec = data.rec;
          var uri = data.parent?
                '/api/v1/project/'+self.project_id+'/node/'+data._id:
                '/api/v1/project/'+self.project_id;
          rec.name = name;
          return Loader.post(uri,
            {
              data: rec
            },
            function(err, rec){
              self.bindEvents();
              if(err){
                return alertify.error(err.error||err);
              }
              data.name = rec.name;
              data.rec = rec;
              update(selection);
            });
        }
        self.bindEvents();
      }, data.name);
    }
  };

  var editNode = function(){
    var selection = d3.select(".node.selected")[0][0];
    if(selection){
      var data = selection.__data__;
      if(data.parent){
        return window.location.href = '#project/'+self.project_id+'/node/'+data._id;
      }
      return window.location.href = '#project/edit/'+self.project_id;
    }
  };

  Mousetrap.bind('ctrl+enter', function(){
    setTimeout(function(){
      editNodeName();
    }, 100);
  });

  Mousetrap.bind('enter', editNode);
  self.chart.doubleClick(editNode);

  Mousetrap.bind('esc', function(){
    if(draggingNode){
      selectedNode=null;
      endDrag();
      draggingNode=null;
    }
  });

  var scanChildren = function(node, nodes, exclude){
    if((exclude||[]).indexOf(node)===-1){
      nodes.push(node);
    }
    (node.children||[]).forEach(function(node){
      scanChildren(node, nodes);
    });
    return nodes;
  };
  var distance = function(firstObject, secondObject){
    var xs = 0;
    var xy = 0;

    xs = secondObject.x0 - firstObject.x0;
    xs = xs * xs;

    ys = secondObject.y0 - firstObject.y0;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  };
  var findNearest = function(n, nodes){
    var d = Number.MAX_VALUE, t, result;
    nodes.forEach(function(node){
      if(n._id !== node._id){
        t = distance(n, node);
        if(t<d){
          result = node;
          d = t;
        }
      }
    });
    return result;
  };
  var nodes, allNodes, dragStarted, draggingNode=null, selectedNode=null, movement;
    // Define the drag listeners for drag/drop behaviour of nodes.
    self.dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (!d.parent) {
                return;
            }
            nodes = scanChildren(d, []);
            allNodes = scanChildren(self.data, [], nodes);
            movement = {
              x: 0,
              y: 0
            }

            dragStarted = true;
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (!d.parent) {
                return;
            }
            if (dragStarted) {
                movement.x+=d3.event.dx;
                movement.y+=d3.event.dy;
                if(Math.abs(movement.x)<20&&Math.abs(movement.y)<20){
                  return;
                }
                domNode = this;
                initiateDrag(d, domNode);
            }

            selectedNode = findNearest(draggingNode, allNodes);
            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if(!draggingNode){
              return;
            }
            if (!d.parent) {
                return;
            }
            domNode = this;
            endDrag();
        });

    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                  x: draggingNode.y0,
                  y: draggingNode.x0
                },
                target: {
                  x: selectedNode.y0,
                  y: selectedNode.x0
                }
            }];
        }
        var link = d3.select(el(self.container, 'svg g')).selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };
    function endDrag() {
      d3.select(domNode).attr('class', 'node');
      updateTempConnector();
      d3.select('.templink').remove();
      if(draggingNode !== null){
        var uri = draggingNode.parent?
              '/api/v1/project/'+self.project_id+'/node/'+draggingNode._id:
              '/api/v1/project/'+self.project_id;
        if(selectedNode){
          draggingNode.rec.parent_id = selectedNode.rec._id;
          draggingNode.parent = selectedNode;
          return Loader.post(uri,
            {
              data: draggingNode.rec
            },
            function(err, rec){
              if(!selectedNode.children){
                selectedNode.children=selectedNode._children||[];
                selectedNode._children=null;
              }
              selectedNode.children.push(draggingNode);
              self.updateNode(selectedNode);
              draggingNode = null;
              selectedNode = null;
            });
        }
      }
      selectedNode = null;
      draggingNode.parent.children=draggingNode.parent._children||[];
      draggingNode.parent._children=null;
      draggingNode.parent.children.push(draggingNode);
      self.updateNode(draggingNode.parent);
    }
    function initiateDrag(d, domNode) {
        draggingNode = d;

        d3.select(container).selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a._id != draggingNode._id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = self.chart.tree.links(nodes);
            nodePaths = d3.select(container).selectAll("path.link")
                .data(links, function(d) {
                    return d.target._id;
                }).remove();
            // remove child nodes
            nodesExit = d3.select(container).selectAll("g.node")
                .data(nodes, function(d) {
                    return d._id;
                }).filter(function(d, i) {
                    if (d._id == draggingNode._id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = self.chart.tree.links(self.chart.tree.nodes(draggingNode.parent));
        d3.select(container).selectAll('path.link').filter(function(d, i) {
            if (d.target._id == draggingNode._id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }
};

MindMapController.prototype.unbindEvents = function(container){
  Mousetrap.unbind('left');
  Mousetrap.unbind('right');
  Mousetrap.unbind('up');
  Mousetrap.unbind('down');
  Mousetrap.unbind('ins');
  Mousetrap.unbind('del');
  Mousetrap.unbind('enter');
};

MindMapController.prototype.updateNode = function(data){
  var self = this;
  d3.select(self.container)
    //.datum(data)
    .call(self.chart)
    ;
};

MindMapController.prototype.update = function(data, focus){
  var self = this;
  self.data = data = data || self.data;
  if(!data){
    return;
  }
  if(data.root && data.nodes && data.edges){
    var tree = {}, nodes = {};
    tree.name = data.root.name;
    tree.children = [];
    tree._id = data.root._id;
    tree.rec = data.root;
    tree.description = data.root.description;
    nodes[data.root._id] = tree;
    data.nodes.forEach(function(node){
      nodes[node._id] = {
        name: node.name,
        _id: node._id,
        rec: node,
        description: node.description,
        children: []
      };
    });
    data.edges.forEach(function(edge){
      if(nodes[edge.source_id] && nodes[edge.destination_id]){
        return nodes[edge.source_id].children.push(nodes[edge.destination_id]);
      }
      if(!nodes[edge.source_id]){
        var msg = 'Invalid: '+edge.source_id+' refrences '+edge.destination_id+' that doesn\'t exist!';
        console.log(msg);
        return alertify.error(msg);
      }
      var msg = 'Invalid: '+edge.destination_id+' refrences '+edge.source_id+' that doesn\'t exist!';
      console.log(msg);
      return alertify.error(msg);
    });
    self.data = data = tree;
  }
  self.chart.nodeClass(function(d){
    return ('node '+(d.rec.status||'').replace(/\s+/g, '-').toLowerCase()).trim();
  });
  self.chart.nodeEnter(function(node){
    node
      .call(self.dragListener)
      ;
    node.append('svg:circle')
        .attr('r', 1e-6);

    node.append('svg:text')
        .attr('text-anchor', 'middle')
        .attr('dy', 14)
        .text(function(d){
          return d.name;
        })
        .style('fill-opacity', 1);
  });
  d3.select(self.container)
    .datum(data)
    .call(self.chart)
    ;
  setTimeout(function(){
    self.selectNode(focus||data._id);
  }, self.chart.duration()+100);
};

MindMapController.prototype.teardown = function(container){
  var self = this;
  self.unbindEvents(container);
  self.container = null;
};

require('../../../lib/controllers').register('MindMap', MindMapController);
