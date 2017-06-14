'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MovieTheaterEndpointSchema = new _mongoose2.default.Schema({
  city: String,
  movie: String,
  theater: String,
  dates: [String],
  times: [String]
});

exports.default = _mongoose2.default.model('movietheaterdetails', MovieTheaterEndpointSchema);
//# sourceMappingURL=movie-theater-endpoint.model.js.map
