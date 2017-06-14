'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PaymentEndpointSchema = new _mongoose2.default.Schema({
  userName: String,
  movieName: String,
  theaterName: String,
  classType: String,
  seatNos: [String],
  date: String,
  time: String
});

exports.default = _mongoose2.default.model('paymentdetails', PaymentEndpointSchema);
//# sourceMappingURL=payment-endpoint.model.js.map
