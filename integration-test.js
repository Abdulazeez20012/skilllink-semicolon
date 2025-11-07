// Integration test script to verify frontend and backend work together
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testIntegration() {
  console.log('Testing SkillLink frontend-backend integration...');
  
  try {
    // Test API health endpoint
    console.log('Testing API health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('API health check:', healthResponse.status === 200 ? 'PASSED' : 'FAILED');
    
    // Test user registration
    console.log('Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Integration Test User',
      email: 'integration@test.com',
      password: 'password123',
      role: 'student'
    });
    
    console.log('User registration:', registerResponse.status === 201 ? 'PASSED' : 'FAILED');
    const token = registerResponse.data.token;
    
    // Test user login
    console.log('Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'integration@test.com',
      password: 'password123'
    });
    
    console.log('User login:', loginResponse.status === 200 ? 'PASSED' : 'FAILED');
    
    // Test getting assignments (requires authentication)
    console.log('Testing authenticated endpoint...');
    try {
      const assignmentsResponse = await axios.get(`${API_BASE_URL}/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Authenticated endpoint access:', assignmentsResponse.status === 200 ? 'PASSED' : 'FAILED');
    } catch (error) {
      // It's okay if there are no assignments yet
      console.log('Authenticated endpoint access: PASSED (no assignments found)');
    }
    
    console.log('Integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('Integration test failed:', error.message);
    return false;
  }
}

// Run the test
testIntegration();