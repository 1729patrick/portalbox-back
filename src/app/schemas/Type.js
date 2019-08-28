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
    toJSON: {
      transform: function(doc, obj) {
        delete obj.__v;
        if (obj.image) obj.image = obj.image.url;
        return obj;
      },
    },
  }
);

export default mongoose.model('Type', TypeSchema);
