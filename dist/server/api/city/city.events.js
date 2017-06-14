/**
 * City model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _city = require('./city.model');

var _city2 = _interopRequireDefault(_city);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CityEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
CityEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _city2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CityEvents.emit(event + ':' + doc._id, doc);
    CityEvents.emit(event, doc);
  };
}

exports.default = CityEvents;
//# sourceMappingURL=city.events.js.map
