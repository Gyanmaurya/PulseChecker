const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middlewares/auth');
const User = require('../models/User');
const { simulateTeamActivity } = require('../utils/simulator');
// @route   GET api/activities
// @desc    Get team activities
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.team) {
      return res.status(400).json({ msg: 'User does not belong to any team' });
    }

    const { range } = req.query;
    let dateFilter = {};

    if (range === 'week') {
      dateFilter = {
        timestamp: {
          $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      };
    } else if (range === 'month') {
      dateFilter = {
        timestamp: {
          $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      };
    } else if (range === 'quarter') {
      dateFilter = {
        timestamp: {
          $gte: new Date(new Date() - 90 * 24 * 60 * 60 * 1000)
        }
      };
    }

    const activities = await Activity.find({
      team: user.team,
      ...dateFilter
    }).populate('user', ['name', 'email']);

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add the activities
router.post('/simulate-activity', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.team) {
            return res.status(400).json({ msg: 'User does not belong to any team' });
        }

        // Generate simulated activity for the user's team
        await simulateTeamActivity(user.team._id);
        
        res.json({ 
            success: true,
            msg: `Simulated activity generated for team ${user.team._id}`
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false,
            msg: 'Server error',
            error: error.message 
        });
    }
});

module.exports = router;