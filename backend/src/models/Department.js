const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
