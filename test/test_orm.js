var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Constructors', function(){
    it('Should take a name in the contstructor', function(done){
      var o = new ORM('test', {});
      assert(o);
      done();
    });
    it('Should take no name in the contstructor', function(done){
      var o = new ORM({});
      assert(o);
      done();
    });
  });
});
