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
        type: mongoose.Schema.ObjectId,
        ref: 'Neighborhood',
        required: true,
      },
      city: {
        type: mongoose.Schema.ObjectId,
        ref: 'City',
        required: true,
      },
    },
    type: { type: mongoose.Schema.ObjectId, ref: 'Type', required: true },
    particulars: [
      {
        title: {
          type: String,
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
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
          type: mongoose.Schema.ObjectId,
          ref: 'File',
          required: true,
        },
        description: String,
      },
    ],
    owner: {
      name: String,
      whatsapp: String,
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
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
        _id: false,
      },
    ],
    company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, obj) {
        if (obj.images)
          obj.images = obj.images.map(({ _id, file, description }) => ({
            _id,
            file: file.url,
            description,
          }));

        return obj;
      },
    },
  }
);

export default mongoose.model('Immobile', ImmobileSchema);
