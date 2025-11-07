// Simple test to verify API structure
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SkillLink API is running' });
});

// Test port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});