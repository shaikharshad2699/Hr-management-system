const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required'],
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: [
      'offer-letter',
      'appointment-letter',
      'experience-letter',
      'salary-slip',
      'relieving-letter',
      'internship-letter',
      'promotion-letter',
      'warning-letter',
      'increment-letter',
      'joining-letter',
    ],
  },
  fileUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'sent'],
    default: 'draft',
  },
}, { timestamps: true });

documentSchema.index({ employeeId: 1, documentType: 1 }, { unique: true });

module.exports = mongoose.model('Document', documentSchema);
