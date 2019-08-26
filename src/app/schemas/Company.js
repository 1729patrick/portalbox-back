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
    phones: [
      {
        number: { type: String, required: true },
        isWhatsapp: { type: Boolean, default: false },
        _id: false,
      },
    ],
    emails: [{ type: String, lowercase: true, _id: false, required: true }],
    address: {
      required: true,
      type: {
        street: {
          type: String,
          required: true,
        },
        number: Number,
        neighborhood: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        cep: {
          type: String,
          required: true,
        },
        lat: Number,
        lng: Number,
      },
    },
    description: {
      type: String,
      required: true,
    },
    logo: { type: mongoose.Schema.ObjectId, ref: 'File', required: true },
    banner: { type: mongoose.Schema.ObjectId, ref: 'File', required: true },
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

        obj.logo = obj.logo.url;
        obj.banner = obj.banner.url;
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
