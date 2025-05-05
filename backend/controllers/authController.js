const User = require('../models/User');
const Team = require('../models/Team');
const jwt = require('jsonwebtoken');
const { generateInviteCode } = require('../utils/helpers');
const bcrypt = require('bcryptjs')
// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, teamCode } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    // If team code provided, join team
    if (teamCode) {
      const team = await Team.findOne({ inviteCode: teamCode });
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      user.team = team._id;
    }

    await user.save();

    // If no team code, create new team
    if (!teamCode) {
      const team = new Team({
        name: `${name}'s Team`,
        inviteCode: generateInviteCode(),
        createdBy: user._id
      });
      await team.save();
      
      user.team = team._id;
      user.isTeamAdmin = true;
      await user.save();
    }

    // Create JWT token
    const payload = { user: { id: user._id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
// Get user to releted to teams
    const user = await User.findOne({ email }).populate('team');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { name: user.name, email: user.email, team: user.team } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    console.log('Fetching user:', req.user.id); // Debug log
    
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'team',
        select: 'name inviteCode createdBy'
      });

    if (!user) {
      console.error('User not found for ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Successfully fetched user:', user); // Debug log
    res.json(user);
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ 
      msg: 'Server error',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};