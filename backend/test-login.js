require('dotenv').config();
const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@company.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\nToken:', response.data.data.token);
    
  } catch (error) {
    console.log('❌ Login failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

testLogin();
