var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Strings', function(){
    it('Should know how to validate Strings', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: 'foo'}, function(err, obj){
        assert(!err);
        assert(obj.v==='foo');
        done();
      });
    });
    it('Should accept blank strings', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: ''}, function(err, obj){
        assert(!err);
        assert(obj.v==='');
        done();
      });
    });
    it('Should fail if no value exists', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if undefined value exists', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: undefined}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if NULL value exists', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: null}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should know how to convert validate Integers', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: 123}, function(err, obj){
        assert(!err);
        assert(obj.v==='123');
        done();
      });
    });
    it('Should know how to convert validate Floats', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: 1.23}, function(err, obj){
        assert(!err);
        assert(obj.v==='1.23');
        done();
      });
    });
    it('Should know how to convert Extended Values', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: 1e5}, function(err, obj){
        assert(!err);
        assert(obj.v==='100000');
        done();
      });
    });
    it('Should know how to convert Booleans', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: true}, function(err, obj){
        assert(!err);
        assert(obj.v==='true');
        done();
      });
    });
    it('Should fail if a passed an Object', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: {}}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Array', function(done){
      var t = new ORM({v: ORM.String()});
      t.validate({v: []}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
  });
});
