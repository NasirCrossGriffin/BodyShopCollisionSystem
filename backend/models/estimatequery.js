const mongoose = require('mongoose');

const EstimateQuerySchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    bodyShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BodyShop',
      required: true,
      index: true
    },

    // Customer reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Vehicle Info (Embedded)
    vehicleYear: {
      type: Number,
      min: 1900,
      max: 2100
    },

    make: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    // Insurance
    insurerName: {
      type: String,
      trim: true
    },

    policyNumber: {
      type: String,
      trim: true
    },

    // Estimate Details
    damageDescription: {
      type: String,
      required: true,
      trim: true
    },

    appointmentDateTime: {
      type: Date,
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ['new', 'reviewing', 'quoted', 'closed'],
      default: 'new',
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EstimateQuery', EstimateQuerySchema);