// environments
const { PORT } = process.env;
const db = require('./config/connection.db');
const app = require('./app');

// listen
app.listen(PORT || 3000, async () => {
  console.log(`run on http://localhost:${PORT || 3000}`);
  await db.initialize();
});
