const axios = require('axios');

const baseURL = 'http://localhost:5000/api';

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

// Test getting all cohorts
async function testGetCohorts(token) {
  try {
    const response = await axios.get(`${baseURL}/cohorts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Get Cohorts Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get Cohorts Error:', error.response?.data || error.message);
  }
}

// Test creating a facilitator user
async function testCreateFacilitator(token) {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test Facilitator',
      email: 'facilitator@test.com',
      password: 'password123',
      role: 'facilitator'
    });
    
    console.log('Facilitator Registration Response:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('Facilitator Registration Error:', error.response?.data || error.message);
  }
}

// Test assigning facilitator to cohort
async function testAssignFacilitator(token, cohortId, facilitatorId) {
  try {
    const response = await axios.post(`${baseURL}/cohorts/${cohortId}/facilitators`, {
      userId: facilitatorId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Assign Facilitator Response:', response.data);
  } catch (error) {
    console.error('Assign Facilitator Error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing SkillLink API - Cohort Management...');
  
  // Test login
  const token = await testLogin();
  
  if (token) {
    // Test getting all cohorts
    const cohorts = await testGetCohorts(token);
    const cohortId = cohorts[0]?._id;
    
    if (cohortId) {
      // Test creating a facilitator
      const facilitatorId = await testCreateFacilitator(token);
      
      if (facilitatorId) {
        // Test assigning facilitator to cohort
        await testAssignFacilitator(token, cohortId, facilitatorId);
      }
    }
  }
}

runTests();