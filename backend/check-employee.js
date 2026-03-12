require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./src/models/Employee');

async function checkEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');

    const employeeId = '698f60755c33d6d510b9b7fc';
    const employee = await Employee.findById(employeeId).populate('department');
    
    if (employee) {
      console.log('✓ Employee found:');
      console.log('Name:', employee.firstName, employee.lastName);
      console.log('Designation:', employee.designation);
      console.log('Department:', employee.department);
      console.log('Salary:', employee.salary);
    } else {
      console.log('✗ Employee not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

checkEmployee();
