import mongoose from 'mongoose';

const ImmobileSchema = new mongoose.Schema(
  {
    address: {
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
    },
    type: { type: String, required: true },
    particulars: [
      {
        title: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        icon: String,
        _id: false,
      },
    ],
    map: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    price: {
      sale: Number,
      rent: Number,
    },
    images: [{ type: mongoose.Schema.ObjectId, ref: 'File' }],
    owner: {
      name: String,
      whatsapp: String,
      cpf: String,
      annotation: String,
    },
    company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Immobile', ImmobileSchema);
