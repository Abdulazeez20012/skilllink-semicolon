const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

// Test registration
async function testRegistration() {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    
    console.log('Registration Response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
  }
}

// Test login
async function testLogin() {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@test.com',
      password: 'password123'
    });
    
    console.log('Login Response:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
  }
}

// Test creating a cohort
async function testCreateCohort(token) {
  try {
    const response = await axios.post(`${baseURL}/cohorts`, {
      name: 'JavaScript Bootcamp',
      description: 'Learn JavaScript from basics to advanced',
      programmingLanguage: 'JavaScript'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Create Cohort Response:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('Create Cohort Error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing SkillLink API...');
  
  // Test registration
  await testRegistration();
  
  // Test login
  const token = await testLogin();
  
  // Test creating a cohort
  if (token) {
    await testCreateCohort(token);
  }
}

runTests();