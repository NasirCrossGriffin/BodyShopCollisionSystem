const mongoose = require('mongoose');

const BodyShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String, // URL or file path
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BodyShop', BodyShopSchema);
