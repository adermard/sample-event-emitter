API Documentation
=================

An event emitter is an object that is capable of binding callback functions
to arbitrary event names and then "triggering" or "emitting" events
that invoke bound handlers at a later time.

If you've ever used jQuery's `on()`, `trigger()`, or `off()`, then you're
already familiar with the event emitter pattern.

---

##### new EventEmitter()

Create a new `EventEmitter` instance.

```js
var emitter = new EventEmitter();

emitter.listeners; // 0
```

##### EventEmitter.prototype.on( event, handler )

Bind a new event handler.

Increments `emitter.listeners` by `1`.

Handlers should be stored for later use so that they can be invoked
via calls to `EventEmitter.prototype.emit()`. Mutltiple handlers may be
bound for each `event` name.

```js
emitter.on( 'hello', function( arg ) {
  console.log( 'Hello, ' + arg );
});

emitter.on( 'hello', function( arg ) {
  console.log( 'Hello again, ' + arg );
});
```

##### EventEmitter.prototype.emit( event [ , arg1, arg2, ... ] )

Trigger an event.

Must invoke *all* handlers bound to the given `event` name.

```js
emitter.emit( 'hello', 'world' );
// 'Hello, world'
// 'Hello again, world'
```

Additional arguments must be passed to bound handlers.

Handlers must be invoked with a `this` context equal to the
`EventEmitter` instance.

##### EventEmitter.prototype.off( [ event ] [ ,handler ] )

Remove all handlers, regardless of `event` name. Resets `emitter.listeners`
to `0`.

```js
emitter.on( 'hello', function() {
  console.log('hello');
});

emitter.on( 'goodbye', function() {
  console.log('goodbye');
});

// removes BOTH of the above handlers
emitter.off();
```

Remove all handlers for a specific `event` name. Decrements `emitter.listeners` by
the number of handlers actually removed.

```js
emitter.on( 'hello', function() {
  console.log('hello');
});

emitter.on( 'goodbye', function() {
  console.log('goodbye');
});

// removes ONLY the 'hello' handler
emitter.off('hello');
```

Remove all handlers for a specific `event` name *only if* the handler is
equal to the passed `handler` parameter. Decrements `emitter.listeners` by
the number of handlers actually removed.

```js
function hi( name ) {
  console.log( 'Hi, ' + name );
}

function hola( name ) {
  console.log( 'Hola, ' + name );
}

// removed
emitter.on( 'hello', hi );
// not removed
emitter.on( 'hello', hola );

// remove 'hello' events whose callback is the `hi` function
emitter.off( 'hello', hi );
```

##### Notes

- All `EventEmitter` methods must return `this` unless otherwise specified.

- All `EventEmitter` instances must include a `listeners` property whose value
is the number of bound listeners. This value must be updated when events are
bound and unbound.

- All matching events that were bound at the time `emit()` was called *must*
be executed, even if one of those events calls `off()`.

```js
var emitter = new EventEmitter();

emitter.on( 'foo', function() {
  emitter.off();
});

emitter.on( 'foo', function() {
  console.log('called');
});

// each bound callback should be executed
emitter.emit('foo');
```

- Calls to `emit()` or `off()` with no matching handlers should not
raise an exception.

##### Bonus

For added credit, ensure that all properties on `EventEmitter` instances are
non-writable and non-configurable.

The test in `test/bonus.js` will aggressively try to break your `EventEmitter`
instances by overwriting properties (included nested properties on objects).

The goal here is to ensure that `EventEmitter` instances are completely safe
from outside interference (i.e. users cannot modify the internal state of an
`EventEmitter`).
