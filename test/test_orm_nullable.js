var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Nullables', function(){
    it('Should take the passed value', function(done){
      var o = new ORM('test', {v: ORM.Nullable()});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should allow a null value', function(done){
      var o = new ORM('test', {v: ORM.Nullable()});
      o.validate({
        v: null
      }, function(err, value){
        assert(!err);
        value.v===null;
        done();
      });
    });
    it('Should provide a null value if none exists', function(done){
      var o = new ORM('test', {v: ORM.Nullable()});
      o.validate({
      }, function(err, value){
        assert(!err);
        value.v===null;
        done();
      });
    });
    it('Should pass if value passes next validation', function(done){
      var o = new ORM('test', {v: ORM.Nullable(ORM.Number())});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should fail if value fails next validation', function(done){
      var o = new ORM('test', {v: ORM.Nullable(ORM.Number())});
      o.validate({
        v: 'foo'
      }, function(err, value){
        assert(err);
        assert(err.errors.length);
        done();
      });
    });
  });
});
