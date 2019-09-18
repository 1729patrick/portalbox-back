const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

FileSchema.virtual('url').get(function() {
  const url = process.env.URL || 'http://192.168.53.102:3333';
  return `${url}/static/files/${encodeURIComponent(this.path)}`;
});

module.exports = mongoose.model('File', FileSchema);
