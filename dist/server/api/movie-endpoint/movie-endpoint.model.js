'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MovieEndpointSchema = new _mongoose2.default.Schema({
  title: String,
  genre: String,
  date: String,
  poster: String,
  plot: String,
  directors: [String],
  producers: [String],
  language: String,
  runtime: String,
  avgRating: Number,
  rating: [{
    userName: String,
    hasRated: Boolean
  }]
});

exports.default = _mongoose2.default.model('moviedetails', MovieEndpointSchema);
//# sourceMappingURL=movie-endpoint.model.js.map
