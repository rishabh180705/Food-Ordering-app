const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'], // Types of discounts: percentage or flat amount
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0, // Ensure the discount value is non-negative
  },
  minOrderValue: {
    type: Number,
    default: 0, // Minimum order value to apply the coupon
  },
  maxDiscount: {
    type: Number,
    default: null, // Applicable only for percentage-based discounts
  },
  usageLimit: {
    type: Number,
    default: null, // Maximum number of times the coupon can be used (overall)
  },
  userLimit: {
    type: Number,
    default: null, // Maximum number of times a single user can use the coupon
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    default: true, // Toggle to activate or deactivate the coupon
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference to the admin who created the coupon
    required: true,
  },
}, { timestamps: true });

// Middleware to ensure valid date range
couponSchema.pre('save', function (next) {
  if (this.validFrom >= this.validTill) {
    return next(new Error('validFrom must be earlier than validTill.'));
  }
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
