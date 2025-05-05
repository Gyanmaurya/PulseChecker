
// Database connection
const mongoose = require('mongoose');
require('dotenv').config()
const databaseUrl = process.env.MONGO_URI;
 const connectDB = async()=>{
   try {
    mongoose.connect(databaseUrl)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.log(err));
   } catch (error) {
    console.error('Database connection error!')
   }
}
module.exports = {connectDB}