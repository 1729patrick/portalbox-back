import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    neighborhoods: {
      required: true,
      unique: true,
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Neighborhood',
          required: true,
          unique: true,
        },
      ],
    },
    company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
  }
);

CitySchema.index({ name: 1, company: 1 }, { unique: true });

const City = mongoose.model('City', CitySchema);
City.createIndexes();

export default City;
