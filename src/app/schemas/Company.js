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
      },
    ],
    emails: [{ type: String, lowercase: true }],
    address: {
      street: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
      },
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
    },
    logo: {
      type: String,
    },
    officeHours: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
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
