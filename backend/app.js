const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');
const activityRoutes = require('./routes/activity');
const userRoutes = require('./routes/userRoutes')
dotenv.config();

const app = express();

// Middleware
// Configure CORS properly
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api',userRoutes)

app.get('/',(req,res)=>{
    res.status(200).send('Welcome to Pusle Checker!')
})

module.exports = app;