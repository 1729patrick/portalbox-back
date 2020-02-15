"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

const TypeSchema = new _mongoose2.default.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    image: { type: _mongoose2.default.Schema.ObjectId, ref: 'File', required: true },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    company: { type: _mongoose2.default.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, obj) {
        delete obj.__v;
        if (obj.image) obj.image = obj.image.url;
        return obj;
      },
    },
  }
);

exports. default = _mongoose2.default.model('Type', TypeSchema);
