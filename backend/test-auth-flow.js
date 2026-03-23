const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const API_URL = 'http://localhost:5003/api';

async function verifyAuthFlow() {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';

  console.log(`Starting verification for ${testEmail}...`);

  try {
    // 1. Register
    console.log('\n[1] Registering user...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
      })
    });
    const regData = await regRes.json();
    console.log('Registration Response:', regData.message);

    // 2. Fetch OTP from file (as if we were the user checking email)
    const fs = require('fs');
    const path = require('path');
    const otpPath = path.join(__dirname, 'temp/last_otp.txt');
    
    // Wait a bit for file to be written
    await new Promise(resolve => setTimeout(resolve, 1000));
    const otp = fs.readFileSync(otpPath, 'utf8');
    console.log('OTP from file:', otp);

    // 3. Verify Email
    console.log('\n[2] Verifying email...');
    const verifyRes = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: otp
      })
    });
    const verifyData = await verifyRes.json();
    console.log('Verification Response:', verifyData.message);

    // 4. Login
    console.log('\n[3] Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData.message);
    if (loginData.success) {
      console.log('Token received:', loginData.data.token.substring(0, 20) + '...');
    }

    console.log('\nSUCCESS: Auth flow working as expected!');
  } catch (error) {
    console.error('\nFAILURE:', error.message);
  }
}

verifyAuthFlow();
