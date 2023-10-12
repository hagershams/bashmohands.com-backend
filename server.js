import app from './src/app.js';
import { config } from 'dotenv';
config({ path: '.env' });

// Port Number
const port = process.env.PORT || 8080;

// Starting Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
