Module System Concept
=====================

All plugins surface routes, actions, and handlers.

EG (of a content plugin):

```
module.exports = function(config, next){
  var server = config.server;
  var Project = new ORM({
    {
      name: ORM.String(),
      version: ORM.Default('0.0.1', ORM.Semver()),
      description: ORM.Optional(ORM.String())
    }
  });
  server.routes([
    {
      secure: false,
      route: 'api/v1/projects',
      method: 'GET',
      handler: getProjects,
      timeout: 5000
    },
    {
      secure: false,
      route: 'api/v1/project',
      method: 'POST',
      handler: createProject,
      ORM: Project,
      timeout: 5000
    },
    {
      secure: false,
      route: 'api/v1/project/{id}',
      method: 'PUT',
      handler: updateProject,
      timeout: 5000
    },
    {
      secure: false,
      route: 'api/v1/project/{id}',
      method: 'DELETE',
      handler: deleteProject,
      timeout: 5000
    },
  ]);
  next();
}
```

EG (of a security plugin):

```
module.exports = function(config, next){
  var server = config.server;
  server.handlers([
    {
      name: 'login',
      type: 'security',
      method: 'validate',
      handler: validateLogin,
      timeout: 100
    }
  ]);

  server.routes([
    {
      secure: false,
      route: 'api/v1/login',
      method: 'POST',
      handler: loginUser,
      ORM: User
    },
    {
      secure: true,
      route: /api/v1/logout',
      method: 'POST',
      handler: logoutUser
    }
  ]);
  next();
}
```

The validateLogin handler is structured as:

```
var validateLogin = function(options, callback){

};
```

Where options contains

  * hash - Hash returned by the login handler as passed to validate
  * config - The configuration object for the route as it was defined

Callback takes two arguments:

  * error - Any error or errors that happened
  * hash - The hash associated with the logged in account

Content Routes
--------------

Registration of content routes is done through the server.routes method.  It
takes an array of route hashs and registers them to both the web server and
the web socket server.

```
server.routes([
  {
    secure: Boolean,
    route: String,
    method: String,
    handler: method,
    payload: ORM,
    params: ORM,
    busEvent: String,
    reform: Reform,
    timeout: Number
  }
]);
```
Route properties are:

  * secure - Optional default false
  * route - Required, provides the HTTP Route and Socket.io Event Name
  * method - Required, HTTP Method and Socket.io Event Name Prefix
  * handler - Optional, specific handler associated to the route, if this is not
    passed in then the message will be delivered to the Service Bus as is
  * payload - The Object Model that this routes payload expects
  * params - The Object Model that this routes params expects
  * busEvent - If a direct forward to the bus this is the event it will be
    forwarded as
  * reform - If a direct forward to the bus this is the reform used to get the
    package ready for the handler service
  * timeout - Default is 5000 (5 seconds) or from global configuration

Routes become available through both Socket.io and REST interface.

Socket.io messages for the sample above would be:

```
GET://api/v1/projects
POST://api/v1/project
PUT://api/v1/project/{id}
DELETE://api/v1/project/{id}
```

Handlers are structured as:

```
var getProjects = function(options, callback){

};
```

Where options contains:

  * params - Hash containing the parameters called with
  * payload - Hash containing the body contents
  * headers - If HTTP request this will be the headers
  * cookies - If HTTP request this is the hash of cookies
  * method - What method (GET, POST, PUT, DELETE, etc...) was called
  * config - The configuration object for the route as it was defined

Callback takes two arguments:

  * error - Any error or errors that happened
  * response - The actual response object

Bubbling up Bus Events
----------------------

There are times when you may want to bubble an event from the backend bus up
to the client through the Socket.io interface.  An example could be when another
user updates a node inside of a graph then send it out for the other connected
clients to pickup and do with as they please.  This can be done using the
options.bus object:

```
var notifyNodeUpdate = function(node){
  this.broadcast('UPDATE://api/v1/project/'+
        node.project_id+'/node/'+node._id, node);
};

module.exports = function(options, next){
  var bus = options.bus;
  var sockets = options.sockets;
  bus.on('node::updated', notifyNodeUpdate.bind(sockets));
};
```

Notice the difference between the private backend message format and the content
message format.  Backend messages delimit message segments using the ::
separator while content messages use the / separator.
