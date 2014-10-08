var ORM = require('../orm/orm');
var assert = require('assert');

describe('ORM', function(){
  describe('Arrays', function(){
    it('Should know how to validate Arrays', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: ['1.2.3']}, function(err, obj){
        assert(!err);
        assert(obj.v instanceof Array);
        assert(obj.v[0]==='1.2.3');
        done();
      });
    });
    it('Should fail if no value exists', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if undefined value exists', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: undefined}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if NULL value exists', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: null}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if value is a Float', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: 1.23}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a value is a String', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: 'foo'}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should fail if a passed an Object', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: {}}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should pass if a passed an empty Array', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: []}, function(err, obj){
        assert(!err);
        assert(obj.v.length===0);
        done();
      });
    });
    it('Should fail if a passed a Boolean', function(done){
      var t = new ORM({v: ORM.Array()});
      t.validate({v: true}, function(err, obj){
        assert(err.errors.length===1);
        assert(err.errors[0].key==='v');
        done();
      });
    });
    it('Should validate sub object structure', function(done){
      var t = new ORM({v: ORM.Array(ORM.Object({v: ORM.Number()}))});
      t.validate({v: [{v: 123}]}, function(err, obj){
        assert(!err);
        assert(obj.v[0].v===123);
        done();
      });
    });
    it('Should validate sub numbers', function(done){
      var t = new ORM({v: ORM.Array(ORM.Number())});
      t.validate({v: [123, '234']}, function(err, obj){
        assert(!err);
        assert(obj.v[0]===123);
        assert(obj.v[1]===234);
        done();
      });
    });
    it('Should fail if the validate of sub numbers fails', function(done){
      var t = new ORM({v: ORM.Array(ORM.Number())});
      t.validate({v: ['foo']}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        done();
      });
    });
    it('Should fail if the sub object fails', function(done){
      var t = new ORM({v: ORM.Array(ORM.Object({v: ORM.Number()}))});
      t.validate({v: [{v: 'foo'}]}, function(err, obj){
        assert(err);
        assert(err.errors.length===1);
        done();
      });
    });
  });
});
