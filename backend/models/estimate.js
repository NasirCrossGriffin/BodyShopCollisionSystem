const mongoose = require('mongoose');

const EstimateSchema = new mongoose.Schema(
  {
    estimateQuery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EstimateQuery',
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('estimate', EstimateSchema);
