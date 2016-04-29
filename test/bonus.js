var assert = require('assert');

describe( 'EventEmitter (bonus)', function() {

  // recursively check objects for non-writable, non-configurable
  // property descriptors
  function check( obj, path ) {
    path = path || '';

    Object.getOwnPropertyNames( obj ).forEach(function( prop ) {
      var orig = obj[ prop ];
      var desc = Object.getOwnPropertyDescriptor( obj, prop );
      var newPath = path + '.' + prop;
      var sealed;

      obj[ prop ] = Math.random() * 1e6;
      assert.strictEqual( obj[ prop ], orig, newPath + ' was able to be overwritten' );
      assert.strictEqual( desc.configurable, false, newPath + ' is missing non-configurable property descriptor' );

      if ( typeof obj[ prop ] === 'object' ) {
        sealed = Object.isSealed( obj[ prop ] );

        assert.strictEqual( sealed, true, newPath + ' was able to have new properties added' );
        check( obj[ prop ], newPath );
      }
    });
  }

  // all own properties should be non-writable and non-configurable
  it( 'should prevent outside interference', function() {
    var EventEmitter = require('../index');
    var emitter = new EventEmitter();

    // bind a listener to make sure any local caches have been populated
    emitter.on( 'foo', function() {} );

    check( emitter, '' );
  });

});
