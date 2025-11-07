const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const config = require('./src/config/config');

// Connect to database
connectDB();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});