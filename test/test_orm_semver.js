var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Semantic versions', function(){
    it('Should know how to validate Semantic versions', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: '1.2.3'}, function(err, obj){
        assert(!err);
        assert(obj.v==='1.2.3');
        done();
      });
    });
    it('Should fail if no value exists', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if undefined value exists', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: undefined}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if NULL value exists', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: null}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if value is a Float', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: 1.23}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an invalid string value', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: 'foo'}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Object', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: {}}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Array', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: []}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed a Boolean', function(done){
      var t = new ORM({v: ORM.Semver()});
      t.validate({v: true}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
  });
});
