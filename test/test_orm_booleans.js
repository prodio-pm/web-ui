var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Booleans', function(){
    it('Should know how to convert valid Integers', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: 123}, function(err, obj){
        assert(!err);
        assert(obj.v===true);
        done();
      });
    });
    it('Should fail if no value exists', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if undefined value exists', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: undefined}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if NULL value exists', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: null}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should know how to validate Floats', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: 1.23}, function(err, obj){
        assert(!err);
        assert(obj.v===true);
        done();
      });
    });
    it('Should know how to validate Strings that represent Booleans', function(done){
      var t = new ORM({v: ORM.Boolean(),f: ORM.Boolean()});
      t.validate({v: 'true', f: 'false'}, function(err, obj){
        assert(!err);
        assert(obj.v===true);
        assert(obj.f===false);
        done();
      });
    });
    it('Should fail if a passed an invalid string value', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: 'foo'}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Object', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: {}}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Array', function(done){
      var t = new ORM({v: ORM.Boolean()});
      t.validate({v: []}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
  });
});
