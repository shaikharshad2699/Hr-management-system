const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    trim: true,
    uppercase: true,
  },

  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  aadharNumber: {
    type: String,
  },
  
  // Education & Certification
  highestEducation: {
    type: String,
  },
  educationCompletionDate: {
    type: Date,
  },
  certifications: {
    type: String,
  },
  
  // Job Information
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required'],
  },
  joiningPackage: {
    type: Number,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    default: 'full-time',
  },
  
  // Salary & Bank Information
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
  },
  bankAccount: {
    type: String,
  },
  bankName: {
    type: String,
  },
  bankBranch: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  
  // Previous Employment
  lastWorkingDay: {
    type: Date,
  },
  lastDesignation: {
    type: String,
  },
  lastDrawnCTC: {
    type: Number,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active',
  },
  
  // Documents
  documents: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
