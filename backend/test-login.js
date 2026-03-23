const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5003/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
