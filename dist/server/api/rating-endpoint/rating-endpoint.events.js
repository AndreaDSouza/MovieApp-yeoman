/**
 * RatingEndpoint model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _ratingEndpoint = require('./rating-endpoint.model');

var _ratingEndpoint2 = _interopRequireDefault(_ratingEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RatingEndpointEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
RatingEndpointEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _ratingEndpoint2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    RatingEndpointEvents.emit(event + ':' + doc._id, doc);
    RatingEndpointEvents.emit(event, doc);
  };
}

exports.default = RatingEndpointEvents;
//# sourceMappingURL=rating-endpoint.events.js.map
