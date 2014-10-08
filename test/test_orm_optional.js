var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Optionals', function(){
    it('Should take the passed value', function(done){
      var o = new ORM('test', {v: ORM.Optional()});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should allow a null value', function(done){
      var o = new ORM('test', {v: ORM.Optional()});
      o.validate({
        v: null
      }, function(err, value){
        assert(!err);
        value.v===null;
        done();
      });
    });
    it('Should provide an undefined value if none exists', function(done){
      var o = new ORM('test', {v: ORM.Optional()});
      o.validate({
      }, function(err, value){
        assert(!err);
        value.v===undefined;
        done();
      });
    });
    it('Should pass if value passes next validation', function(done){
      var o = new ORM('test', {v: ORM.Optional(ORM.Number())});
      o.validate({
        v: 123
      }, function(err, value){
        assert(!err);
        value.v===123;
        done();
      });
    });
    it('Should fail if value fails next validation', function(done){
      var o = new ORM('test', {v: ORM.Optional(ORM.Number())});
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
