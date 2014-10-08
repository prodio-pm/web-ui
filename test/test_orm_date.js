var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Dates', function(){
    it('Should pass a valid Date object', function(done){
      var o = new ORM(ORM.Date());
      o.validate(new Date(), function(err, date){
        assert(!err);
        assert(date instanceof Date);
        done();
      });
    });
    it('Should pass a valid string form of a Date object', function(done){
      var o = new ORM(ORM.Date());
      o.validate(new Date().toISOString(), function(err, date){
        assert(!err);
        assert(date instanceof Date);
        done();
      });
    });
    it('Should fail with a Number', function(done){
      var o = new ORM(ORM.Date());
      o.validate(1234, function(err, date){
        assert(err);
        done();
      });
    });
    it('Should fail with an invalid String', function(done){
      var o = new ORM(ORM.Date());
      o.validate('foo', function(err, date){
        assert(err);
        done();
      });
    });
    it('Should fail with an Object', function(done){
      var o = new ORM(ORM.Date());
      o.validate({foo: 'bar'}, function(err, date){
        assert(err);
        done();
      });
    });
    it('Should fail with an Array', function(done){
      var o = new ORM(ORM.Date());
      o.validate([1234], function(err, date){
        assert(err);
        done();
      });
    });
    it('Should fail with a Boolean', function(done){
      var o = new ORM(ORM.Date());
      o.validate(true, function(err, date){
        assert(err);
        done();
      });
    });
  });
});
