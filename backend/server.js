const app = require('./app');
const { connectDB } = require('./config/db');
const PORT = process.env.PORT || 3008;

app.listen(PORT, async() => {
    await connectDB()
  console.log(`Server running on port http://localhost:${PORT}`);
});