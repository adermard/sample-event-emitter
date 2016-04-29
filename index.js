//
// EventEmmitter
//
//  This development pattern is not my favorite because there is no destructor that is cleaning
//  up the objects inside the central handler store but I wanted all of the test cases to pass.
//  Maybe we can chat about a better dev pattern during an onsite interview.

var IDAutoIncrementor = 0;
var EECentralHandlerStore = {
  countHandlers: function(eeid) {
    var num = 0;
    for (var event in this[eeid]) {
      num += (this[eeid].hasOwnProperty(event) && Array.isArray(this[eeid][event])) ? this[eeid][event].length : 0;
    }
    return num;    
  }
};

EventEmitter = function() {
  Object.defineProperty(this, 'id', { value: IDAutoIncrementor += 1});
  Object.defineProperty(this, 'listeners', { get: function() { return EECentralHandlerStore.countHandlers(this.id); } });
  
  EECentralHandlerStore[this.id] = {};
};

// deleteArrayValue()
//  Remove all instances of value from array
//  Return the number of items removed
var deleteArrayValue = function(array, value)
{
  var originalLength = array.length;
  for (var i = 0; i < originalLength; i++) {
    var v = array.shift();
    if (v !== value)
      array.push(v);
  }
  return originalLength - array.length;
};

var checkArg = function(arg, argType, eMsg)
{
  if (typeof(arg) != argType)
    throw new TypeError(eMsg);
};

// on
// Register a handler method to be invoked when the event is emitted
EventEmitter.prototype.on = function(event, handler) {
  // TODO allow event to be any literal
  checkArg(event, 'string', 'event is not a string');
  checkArg(handler, 'function', 'handler is not a function');
  
  // register handler
  if (EECentralHandlerStore[this.id][event] === undefined)
    EECentralHandlerStore[this.id][event] = [];
  EECentralHandlerStore[this.id][event].push(handler)

  return this;
};

// off
// Remove a handler method to be invoked when the event is emitted
EventEmitter.prototype.off = function(event, handler) {
  if (arguments.length == 0) {
      EECentralHandlerStore[this.id] = {};
  } else if (arguments.length == 1) {
    // Remove all handlers for event, remove property entirely
    checkArg(event, 'string', 'event is not a string');
    delete(EECentralHandlerStore[this.id][event]);
  } else {
    // Remove all instances of this handler  
    checkArg(handler, 'function', 'handler is not a function');
    deleteArrayValue(EECentralHandlerStore[this.id][event], handler);
  }
  return this;
};

// emit
// Invoke an event by name and trigger all registered handlers to be run
EventEmitter.prototype.emit = function() {
  var arglist = [];
  Array.prototype.push.apply(arglist, arguments);

  var event = arglist.shift();
  checkArg(event, 'string', 'event name is not a string');

  // If this event has handlers then execute them all without interference
  var exec = (EECentralHandlerStore[this.id][event] || []).slice();
  for (var j = 0; j < exec.length; j++) {
    exec[j].apply(this, arglist);
  }
  return this;
};

module.exports = EventEmitter;
