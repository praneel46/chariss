const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/password');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Excluded from default queries to prevent accidental exposure
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash password before persisting to MongoDB
userSchema.pre('save', async function (next) {
  // Only hash password if it was modified (or is newly created).
  // Unrelated profile updates (name, email, role, etc.) leave existing password hash untouched.
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to safely compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // this.password must have been loaded explicitly via .select('+password')
  if (!this.password) {
    throw new Error('Password was not selected in query. Use .select("+password") for authentication verification.');
  }
  return comparePassword(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
