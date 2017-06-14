/**
 * PaymentEndpoint model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _paymentEndpoint = require('./payment-endpoint.model');

var _paymentEndpoint2 = _interopRequireDefault(_paymentEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PaymentEndpointEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
PaymentEndpointEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _paymentEndpoint2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    PaymentEndpointEvents.emit(event + ':' + doc._id, doc);
    PaymentEndpointEvents.emit(event, doc);
  };
}

exports.default = PaymentEndpointEvents;
//# sourceMappingURL=payment-endpoint.events.js.map
