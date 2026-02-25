const mongoose = require('mongoose');

const EstimatePhotoSchema = new mongoose.Schema(
  {
    estimateQuery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EstimateQuery',
      required: true,
      index: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('estimatephoto', EstimatePhotoSchema);
