require('dotenv').config();
const mongoose = require('mongoose');
const pdfService = require('./src/services/pdfService');

const testEmployee = {
  firstName: 'Test',
  lastName: 'Employee',
  designation: 'Software Engineer',
  department: { name: 'IT' },
  salary: 500000,
  joiningDate: new Date()
};

async function test() {
  try {
    console.log('Testing increment-letter generation...');
    const pdfBuffer = await pdfService.createDocument('increment-letter', testEmployee);
    console.log('✓ PDF generated successfully!');
    console.log('PDF size:', pdfBuffer.length, 'bytes');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();
