const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const config = require('./src/config/config');

dotenv.config();

// Connect to database
connectDB();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});