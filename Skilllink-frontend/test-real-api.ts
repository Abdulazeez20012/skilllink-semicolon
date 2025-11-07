// Test file to verify real API integration
import { realApi } from './services/realApi';

// Test function to verify API connection
export const testApiConnection = async () => {
  console.log('Testing real API connection...');
  
  try {
    // Try to register a test user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student' as const
    };
    
    console.log('Attempting to register user...');
    const registerResult = await realApi.register(userData);
    console.log('Registration successful:', registerResult);
    
    // Try to login
    console.log('Attempting to login...');
    const loginResult = await realApi.login(
      { email: 'test@example.com', password: 'password123' },
      'student'
    );
    console.log('Login successful:', loginResult);
    
    console.log('API connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  testApiConnection();
}