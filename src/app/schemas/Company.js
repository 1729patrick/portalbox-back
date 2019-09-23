import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CompanySchema = new mongoose.Schema(
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
        type: mongoose.Schema.ObjectId,
        ref: 'Neighborhood',
      }, // required for update
      city: { type: mongoose.Schema.ObjectId, ref: 'City' }, // required for update
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
    logo: { type: mongoose.Schema.ObjectId, ref: 'File' }, // required for update
    banner: { type: mongoose.Schema.ObjectId, ref: 'File' }, // required for update
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
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

CompanySchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('Company', CompanySchema);
