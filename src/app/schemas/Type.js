import mongoose from 'mongoose';

const TypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: mongoose.Schema.ObjectId, ref: 'File', required: true },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Type', TypeSchema);
