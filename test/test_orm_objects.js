var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Objects', function(){
    it('Should pass an empty Object', function(done){
      var o = new ORM({});
      o.validate({}, function(err, obj){
        assert(!err);
        done();
      });
    });
    it('Should migrate members to meta if not part of the prototype', function(done){
      var o = new ORM({});
      o.validate({foo: 'bar'}, function(err, obj){
        assert(!err);
        assert(obj.meta.foo);
        done();
      });
    });
    it('Should validate child members', function(done){
      var o = new ORM({i: ORM.Number(), s: ORM.String(), a: ORM.Array()});
      o.validate({i: 1234, s: 'string', a: []}, function(err, obj){
        assert(!err);
        assert(obj.i === 1234);
        assert(obj.s === 'string');
        assert(obj.a instanceof Array);
        done();
      });
    });
    it('Should validate child Arrays', function(done){
      var o = new ORM({a: ORM.Array(ORM.Number())});
      o.validate({a: [1234, '234']}, function(err, obj){
        assert(!err);
        assert(obj.a instanceof Array);
        assert(obj.a[0]===1234);
        assert(obj.a[1]===234);
        done();
      });
    });
    it('Should fail for invalid child Arrays', function(done){
      var o = new ORM({a: ORM.Array(ORM.Number())});
      o.validate({a: [1234, 'foo']}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='a');
        assert(err.errors[0].error.errors.length===1);
        done();
      });
    });
    it('Should fail with a String', function(done){
      var o = new ORM({});
      o.validate('foo', function(err, obj){
        assert(err);
        done();
      });
    });
    it('Should fail with a Number', function(done){
      var o = new ORM({});
      o.validate(1234, function(err, obj){
        assert(err);
        done();
      });
    });
    it('Should fail with a Date', function(done){
      var o = new ORM({});
      o.validate(new Date(), function(err, obj){
        assert(err);
        done();
      });
    });
    it('Should fail with an Array', function(done){
      var o = new ORM({});
      o.validate([], function(err, obj){
        assert(err);
        done();
      });
    });
    it('Should fail with a Boolean', function(done){
      var o = new ORM({});
      o.validate(true, function(err, obj){
        assert(err);
        done();
      });
    });
    it('Should fail with a Regular Expression', function(done){
      var o = new ORM({});
      o.validate(/foo/, function(err, obj){
        assert(err);
        done();
      });
    });
  });
});
