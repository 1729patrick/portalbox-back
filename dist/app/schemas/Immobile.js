"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

const ImmobileSchema = new _mongoose2.default.Schema(
  {
    address: {
      street: {
        type: String,
        required: true,
      },
      number: Number,
      neighborhood: {
        type: _mongoose2.default.Schema.ObjectId,
        ref: 'Neighborhood',
        required: true,
      },
      city: {
        type: _mongoose2.default.Schema.ObjectId,
        ref: 'City',
        required: true,
      },
    },
    type: { type: _mongoose2.default.Schema.ObjectId, ref: 'Type', required: true },
    particulars: [
      {
        title: {
          type: String,
          required: true,
        },
        value: {
          type: _mongoose2.default.Schema.Types.Mixed,
          required: true,
        },
        _id: false,
      },
    ],
    map: {
      lat: Number,
      lng: Number,
    },
    price: {
      sale: Number,
      rent: Number,
    },
    images: [
      {
        file: {
          type: _mongoose2.default.Schema.ObjectId,
          ref: 'File',
          required: true,
        },
        description: String,
      },
    ],
    owner: {
      name: String,
      whatsapp: Number,
      cpf: String,
      annotation: String,
    },
    config: {
      sessions: [Number],
    },
    rates: [
      {
        title: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        _id: false,
      },
    ],
    company: { type: _mongoose2.default.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, obj) {
        if (obj.images)
          obj.images = obj.images.map(({ _id, file, description }) => ({
            _id,
            file: file ? file.url : null,
            description,
          }));

        return obj;
      },
    },
  }
);

exports. default = _mongoose2.default.model('Immobile', ImmobileSchema);
