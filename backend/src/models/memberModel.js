// backend/src/models/memberModel.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    packageType: {
      type: String,
      required: [true, 'Package type is required'],
      enum: {
        values: ['basic', 'premium', 'elite', 'trial'],
        message: '{VALUE} is not a valid package type'
      },
      default: 'basic'
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'expired'],
      default: 'active'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    medicalInfo: {
      bloodGroup: String,
      allergies: [String],
      medicalConditions: [String]
    },
    paymentHistory: [{
      amount: Number,
      date: { type: Date, default: Date.now },
      paymentMethod: String,
      transactionId: String
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for checking if membership is expired
memberSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for days remaining
memberSchema.virtual('daysRemaining').get(function() {
  const diff = this.expiryDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Index for faster queries
memberSchema.index({ email: 1, phone: 1 });
memberSchema.index({ membershipStatus: 1, expiryDate: 1 });

// Pre-save middleware to auto-update status
memberSchema.pre('save', function(next) {
  if (this.expiryDate < new Date() && this.membershipStatus === 'active') {
    this.membershipStatus = 'expired';
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;