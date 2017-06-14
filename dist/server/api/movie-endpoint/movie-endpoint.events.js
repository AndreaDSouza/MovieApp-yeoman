/**
 * MovieEndpoint model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _movieEndpoint = require('./movie-endpoint.model');

var _movieEndpoint2 = _interopRequireDefault(_movieEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MovieEndpointEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
MovieEndpointEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _movieEndpoint2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    MovieEndpointEvents.emit(event + ':' + doc._id, doc);
    MovieEndpointEvents.emit(event, doc);
  };
}

exports.default = MovieEndpointEvents;
//# sourceMappingURL=movie-endpoint.events.js.map
