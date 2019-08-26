import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    neighborhoods: {
      required: true,
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Neighborhood',
          required: true,
        },
      ],
    },
    company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('City', CitySchema);
