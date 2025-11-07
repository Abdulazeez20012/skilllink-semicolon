const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./src/config/config');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('JWT_SECRET from config:', config.jwtSecret);
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);

// Generate a token
const testId = 'test123';
const token = jwt.sign({ id: testId }, config.jwtSecret, {
  expiresIn: config.jwtExpire
});

console.log('Generated token:', token);

// Verify the token
try {
  const decoded = jwt.verify(token, config.jwtSecret);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.log('Token verification failed:', error.message);
}