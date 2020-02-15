"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

const CitySchema = new _mongoose2.default.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    neighborhoods: {
      required: true,
      type: [
        {
          type: _mongoose2.default.Schema.ObjectId,
          ref: 'Neighborhood',
          required: true,
        },
      ],
    },
    company: { type: _mongoose2.default.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
  }
);

exports. default = _mongoose2.default.model('City', CitySchema);
