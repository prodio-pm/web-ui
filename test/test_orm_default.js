var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Defaults', function(){
    it('Should take the passed value', function(done){
      var o = new ORM('test', {v: ORM.Default('foo')});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should provide the default value', function(done){
      var o = new ORM('test', {v: ORM.Default('foo')});
      o.validate({
      }, function(err, value){
        assert(!err);
        value.v==='foo';
        done();
      });
    });
    it('Should pass if value passes next validation', function(done){
      var o = new ORM('test', {v: ORM.Default(234, ORM.Number())});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should fail if value fails next validation', function(done){
      var o = new ORM('test', {v: ORM.Default(234, ORM.Number())});
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
