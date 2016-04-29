var assert = require('assert');

describe( 'EventEmitter (core)', function() {

  describe( 'constructor', function() {

    it( 'should be a function', function() {
      var EventEmitter = require('../index');

      assert.equal( typeof EventEmitter, 'function', 'EventEmitter is not a function' );
    });

    it( 'should initialize `this.listeners` with a value of `0`', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.strictEqual( emitter.listeners, 0, 'new EventEmitter instance has missing or incorrect `listeners` value' );
    });

  });

  describe( '#on', function() {

    it( 'should be a method', function() {
      var EventEmitter = require('../index');

      assert.equal( typeof EventEmitter.prototype.on, 'function', 'EventEmitter#on is not a function' );
    });

    it( 'should throw a TypeError when first argument is not a string', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.on( 123 );
      }, TypeError );
    });

    it( 'should throw a TypeError when first argument is undefined', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.on( undefined );
      }, TypeError );
    });

    it( 'should throw a TypeError when second argument is not a function', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.on( 'foo', [] );
      }, TypeError );
    });

    it( 'should throw a TypeError when second argument is undefined', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.on( 'foo', undefined );
      }, TypeError );
    });

    it( 'should increment `this.listeners`', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      emitter.on( 'foo', function() {} );

      assert.strictEqual( emitter.listeners, 1, '`listeners` value not updated after calling `on()` ' );
    });

    it( 'should return `this`', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var result = emitter.on( 'foo', function() {} );

      assert.strictEqual( result, emitter, 'EventEmitter#on did not return `this`' );
    });

    it( 'should not invoke handlers', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var called = false;

      emitter.on( 'foo', function() {
        called = true;
      });

      assert.strictEqual( called, false, 'EventEmitter#on invoked handler without call to `emit()' );
    });

  });

  describe( '#emit', function() {

    it( 'should be a method', function() {
      var EventEmitter = require('../index');

      assert.equal( typeof EventEmitter.prototype.emit, 'function', 'EventEmitter#emit is not a function' );
    });

    it( 'should throw a TypeError when first argument is not a string', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.emit( 123 );
      }, TypeError );
    });

    it( 'should throw a TypeError when first argument is undefined', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.emit( undefined );
      }, TypeError );
    });

    it( 'should return `this`', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var result = emitter.emit( 'foo', function() {} );

      assert.strictEqual( result, emitter, 'EventEmitter#emit did not return `this`' );
    });

    it( 'should invoke bound listeners', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var calledA = false;
      var calledB = false;
      var calledC = false;
      var calledD = false;

      emitter.on( 'foo', function() {
        calledA = true;
      });

      emitter.on( 'foo', function() {
        calledB = true;
      });

      emitter.on( 'bar', function() {
        calledC = true;
      });

      // `baz` never gets emitted, so this should never be called
      emitter.on( 'baz', function() {
        calledD = true;
      });

      emitter.emit('foo');
      emitter.emit('bar');

      assert( calledA && calledB && calledC, 'One ore more bound listeners was not executed' );
      assert( !calledD, 'A non-targeted listener was executed' );
    });

    it( 'should provide `this` context to bound listeners', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var ctx;

      emitter.on( 'foo', function() {
        ctx = this;
      });

      emitter.emit('foo');

      assert.strictEqual( ctx, emitter, 'Bound listener was not invoked with correct `this` context' );
    });

    it( 'should pass additional arguments to bound listeners', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var args = [];

      emitter.on( 'foo', function( a, b, c ) {
        args.push( a, b, c );
      });

      emitter.emit( 'foo', 1, 2, 3 );

      args = args.join('');

      assert.strictEqual( args, '123', 'Additional arguments were not passed to the bound listener' );
    });

    it( 'should invoke all bound listeners, even if one calls off()', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var called = 0;

      emitter.on( 'foo', function() {
        called++;
        emitter.off();
      });

      // this should still get called, since it was bound at the time
      // we called `emit()`
      emitter.on( 'foo', function() {
        called++;
      });

      emitter.emit('foo');

      assert.strictEqual( called, 2, 'Queued listener was not invoked' );
    });

    it( 'should scope events to the instance they were bound to', function() {
      var EventEmitter = require('../index');
      var emitter1 = new EventEmitter();
      var emitter2 = new EventEmitter();
      var called = 0;

      emitter1.on( 'foo', function() {
        called++;
      });

      // should not be called
      emitter2.on( 'foo', function() {
        called++;
      });

      emitter1.emit('foo');

      assert.strictEqual( called, 1, 'Event emitted on non-targeted instance' );
    });

  });

  describe( '#off', function() {

    it( 'should be a method', function() {
      var EventEmitter = require('../index');

      assert.equal( typeof EventEmitter.prototype.off, 'function', 'EventEmitter#off is not a function' );
    });

    it( 'should remove all listeners when no args are passed', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var called = 0;
      var result;

      emitter.on( 'a', function() {
        called++;
      });

      emitter.on( 'b', function() {
        called++;
      });

      result = emitter.off();

      emitter.emit('a');
      emitter.emit('b');

      assert.strictEqual( called, 0, 'One or more events was not unbound' );
      assert.strictEqual( result, emitter, 'Did not return `this`' );
      assert.strictEqual( emitter.listeners, 0, '`listeners` value was not correctly updated' );
    });

    it( 'should throw a TypeError when first arg is not a string', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.off( 123 );
      }, TypeError );
    });

    it( 'should throw a TypeError when first arg is undefined', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.off( undefined );
      }, TypeError );
    });

    it( 'should remove bound listeners by event name', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var calledA = 0;
      var calledB = 0;
      var result;

      emitter.on( 'a', function() {
        calledA++;
      });

      emitter.on( 'a', function() {
        calledA++;
      });

      emitter.on( 'b', function() {
        calledB++;
      });

      result = emitter.off('a');

      emitter.emit('a');
      emitter.emit('b');

      assert.strictEqual( calledA, 0, 'One or more events was not unbound' );
      assert.strictEqual( calledB, 1, 'A non-targeted listener was unbound' );
      assert.strictEqual( emitter.listeners, 1, '`listeners` value was not correctely updated' );
      assert.strictEqual( result, emitter, 'Did not return `this`' );
    });

    it( 'should throw a TypeError when second arg is not a function', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.off( 'foo', [] );
      }, TypeError );
    });

    it( 'should throw a TypeError when second arg is undefined', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();

      assert.throws(function() {
        emitter.off( 'foo', undefined );
      }, TypeError );
    });

    it( 'should remove bound listeners by event name and callback', function() {
      var EventEmitter = require('../index');
      var emitter = new EventEmitter();
      var calledA = 0;
      var calledB = 0;
      var result;

      function fnA() {
        calledA++;
      }

      function fnB() {
        calledB++;
      }

      emitter.on( 'a', fnA );
      emitter.on( 'a', fnA );
      emitter.on( 'a', fnB );

      // only targeting 'a' events, so this should not be unbound
      // when we call `off( 'a', fnA )`
      emitter.on( 'b', fnA );

      result = emitter.off( 'a', fnA );

      emitter.emit('a');

      assert.strictEqual( calledA, 0, 'One or more events was not unbound' );
      assert.strictEqual( calledB, 1, 'A non-targeted listener was unbound' );
      assert.strictEqual( emitter.listeners, 2, '`listeners` value was not correctely updated' );
      assert.strictEqual( result, emitter, 'Did not return `this`' );

      // make sure our 'b' event was not unbound
      emitter.emit('b');
      assert.strictEqual( calledA, 1, 'A non-targeted listener was unbound' );
    });

    it( 'should scope events to the instance they were bound to', function() {
      var EventEmitter = require('../index');
      var emitter1 = new EventEmitter();
      var emitter2 = new EventEmitter();
      var called = 0;

      emitter1.on( 'foo', function() {
        called++;
      });

      // should not be unbound
      emitter2.on( 'foo', function() {
        called++;
      });

      emitter1.off('foo');

      emitter2.emit('foo');

      assert.strictEqual( called, 1, 'Event unbound from non-targeted instance' );
    });

  });

});
