var logger = require('../../lib/logger');
var utils = require('../../lib/utils');
var noop = function(){};

var LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

var logEvent = function logEvent(ctx, data, request){
  var obj = {};
  var msg = '';
  var type = typeof(data.data);

  obj.request = obj.request||{};
  if(ctx.includePayload && request && request.payload){
    obj.request.payload = request.payload;
  }

  if(ctx.includeHeaders){
    obj.request.headers = request.headers;
  }

  if(ctx.includeResponse && request.response){
    var res = {}, include = false;
    if(request.response.headers){
      res.headers = request.response.headers;
      include = true;
    }
    if(request.response.source){
      try{
        res.payload = typeof(request.response.source)==='object'?
          JSON.parse(JSON.stringify(request.response.source)):
          request.response.source;
          include = true;
      }catch(e){
        //res.payload = request.response.source;
      }
    }
    if(include){
      obj.response = res;
    }
  }

  if(ctx.includeTags){
    obj.tags = ctx.joinTags ? data.tags.join(ctx.joinTags) : data.tags;
  }

  if(request){
    obj.req_id = request.id;
    obj.url = request.url.path;
    obj.method = request.method.toUpperCase();
  }

  if(type==='string'){
    msg = data.data;
  }

  if(type!=='string'&&type!=='undefined'&&ctx.includeData){
    obj.data = ctx.mergeData?utils.extend(obj, data.data):data.data;
  }

  if(type==='undefined'&&ctx.skipUndefined){
    return;
  }

  ctx.log[ctx.level](obj, msg);
};

var setDefault = function setDefault(on, member, value){
  if(typeof(on[member])==='undefined'){
    on[member] = value;
  }
};

var bunyan = function bunyan(server, options, next){
  if(!options.logger){
    return next(new Error('options.logger required'));
  }
  var log = options.logger;
  var handler = options.handler||noop;

  setDefault(options, 'includeTags', true);
  setDefault(options, 'includeData', true);
  setDefault(options, 'mergeData', false);
  setDefault(options, 'skipUndefined', false);
  //setDefault(options, 'joinTags', ', ');
  setDefault(options, 'includePayload', true);
  setDefault(options, 'includeResponse', true);
  setDefault(options, 'includeHeaders', true);

  server.ext('onRequest', function(request, next){
    var _log = request.log;
    request.log = function(){
      _log.apply(request, arguments);
    };
    request.bunyan = log.child({req_id: request.id});
    LOG_LEVELS.forEach(function(level){
      request.log[level]=request.bunyan[level].bind(request.bunyan);
    });
    next();
  });

  server.events.on('log', function(data, tags){
    var ctx = {
      level: tags.error?'error':'info',
      log: log,
      includeTags: options.includeTags,
      includeData: options.includeData,
      mergeData: options.mergeData,
      skipUndefined: options.skipUndefined,
      includePayload: options.includePayload,
      includeResponse: options.includeResponse,
      includeHeaders: options.includeHeaders,
      joinTags: options.joinTags
    };
    if(handler.call(ctx, 'log', data, tags)){
      return;
    }
    logEvent(ctx, data);
  });

  server.events.on('request', function(request, data, tags){
    var ctx = {
      level: tags.error?'warn':'info',
      log: log,
      includeTags: options.includeTags,
      includeData: options.includeData,
      mergeData: options.mergeData,
      skipUndefined: options.skipUndefined,
      includePayload: options.includePayload,
      includeResponse: options.includeResponse,
      includeHeaders: options.includeHeaders,
      joinTags: options.joinTags
    };
    if(handler.call(ctx, 'request', request, data, tags)){
      return;
    }
    logEvent(ctx, data, request);
  });
};

bunyan.attributes ={
  name: 'bunyan-logger'
};

module.exports = function(options, next){
  var config = {
    plugin: {
      register: bunyan
    },
    options: utils.extend(options.config, {
      logger: logger
    })
  };
  options.hapi.pack.register(config, function(err){
    if(err){
      throw err;
    }
  });
  next();
};
