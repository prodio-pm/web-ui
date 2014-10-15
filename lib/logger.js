var fs = require('fs');
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'Prodio-web'});

module.exports = logger;
