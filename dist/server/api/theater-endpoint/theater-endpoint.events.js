/**
 * TheaterEndpoint model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _theaterEndpoint = require('./theater-endpoint.model');

var _theaterEndpoint2 = _interopRequireDefault(_theaterEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TheaterEndpointEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
TheaterEndpointEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _theaterEndpoint2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    TheaterEndpointEvents.emit(event + ':' + doc._id, doc);
    TheaterEndpointEvents.emit(event, doc);
  };
}

exports.default = TheaterEndpointEvents;
//# sourceMappingURL=theater-endpoint.events.js.map
