"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

const CompanySchema = new _mongoose2.default.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creci: {
      type: String,
    },
    phones: {
      type: [
        {
          number: { type: String, required: true },
          type: { type: { _id: String, name: String }, required: true }, // change to ENUM
          description: { type: String, required: true },
          _id: false,
        },
      ],
      required: true,
    },
    emails: {
      type: [
        {
          email: { type: String, lowercase: true },
          type: { type: { _id: String, name: String }, required: true }, // change to ENUM
          showInPortal: { type: Boolean, required: true },
          _id: false,
        },
      ],
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      number: Number,
      neighborhood: {
        type: _mongoose2.default.Schema.ObjectId,
        ref: 'Neighborhood',
      }, // required for update
      city: { type: _mongoose2.default.Schema.ObjectId, ref: 'City' }, // required for update
      cep: {
        type: String,
        required: true,
      },
      lat: Number,
      lng: Number,
    },
    description: {
      type: String,
      required: true,
    },
    logo: { type: _mongoose2.default.Schema.ObjectId, ref: 'File' }, // required for update
    banner: { type: _mongoose2.default.Schema.ObjectId, ref: 'File' }, // required for update
    officeHours: String,
    domains: {
      type: [{ type: String, required: true, _id: false }],
      validate: v => v.length,
      unique: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, obj) {
        delete obj.__v;
        delete obj.password;
        delete obj.domains;

        obj.logo = obj.logo ? obj.logo.url : null;
        obj.banner = obj.banner ? obj.banner.url : null;

        if (obj.address) {
          obj.address.city = obj.address.city
            ? {
                _id: obj.address.city._id,
                name: obj.address.city.name,
              }
            : null;

          obj.address.neighborhood = obj.address.neighborhood
            ? {
                _id: obj.address.neighborhood._id,
                name: obj.address.neighborhood.name,
              }
            : null;
        }

        return obj;
      },
    },
  }
);

CompanySchema.pre('save', function(next) {
  this.password = _bcryptjs2.default.hashSync(this.password, 8);
  next();
});

CompanySchema.pre('findOneAndUpdate', function(next) {
  const company = this.getUpdate();
  company.password = _bcryptjs2.default.hashSync(company.password, 8);

  this.update({}, company).exec();

  next();
});

CompanySchema.methods.checkPassword = function(password) {
  return _bcryptjs2.default.compareSync(password, this.password);
};

exports. default = _mongoose2.default.model('Company', CompanySchema);
