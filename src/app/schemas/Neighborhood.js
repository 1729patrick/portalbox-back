import mongoose from 'mongoose';

const NeighborhoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Neighborhood', NeighborhoodSchema);
