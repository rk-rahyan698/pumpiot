require('dotenv').config();
const db = require('./models/db');
const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Express backend listening on port ${PORT}`);
});
