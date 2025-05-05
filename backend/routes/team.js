const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');
const { generateInviteCode } = require('../utils/helpers');


// DELETE OLD TEAM AND JOIN NEW TEAM
// @route   POST api/teams/create-new-team
// @desc    Create new team
// @access  Private
// When any team member want to create new team
router.post('/create-new-team', auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user.isTeamAdmin){
        return res.status(400).json({ msg: 'Only Admin can do this' });
    }
    if (user.team) {
      await Team.updateOne(
        { _id: user.team },
        { $pull: { members: user._id } } 
      );
    }
  
  
    const newTeam = new Team({
      name: req.body.name,
      inviteCode: generateInviteCode(),
      createdBy: user._id
    });
    await newTeam.save();
  
    user.team = newTeam._id;
    user.isTeamAdmin = true;
    await user.save();
    res.json(newTeam);
  });

router.post(
  '/',
  auth,
  [
    check('name', 'Team name is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      const { name } = req.body;
      
      // Check if user already has a team
      const user = await User.findById(req.user.id);
      if (user.team) {
        return res.status(400).json({ msg: 'User already belongs to a team' });
      }

      // Create new team
      const team = new Team({
        name,
        inviteCode: generateInviteCode(),
        createdBy: req.user.id
      });

      await team.save();

      // Add team to user
      user.team = team._id;
      user.isTeamAdmin = true;
      await user.save();

      res.json(team);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/teams/members
// @desc    Get team members
// @access  Private
router.get('/members', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.team) {
      return res.status(400).json({ msg: 'User does not belong to any team' });
    }

    const members = await User.find({ team: user.team }).select('-password');
    res.json(members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/teams/join
// @desc    Join existing team
// @access  Private
// When team member want to join any or other team
router.put(
  '/join',
  auth,
  [
    check('teamCode', 'Team code is required').not().isEmpty()
  ],
  async (req, res) => {
    try {
      const { teamCode } = req.body;
      const user = await User.findById(req.user.id);

      // Check if already in a team
      if (user.team) {
        return res.status(400).json({ msg: 'User already belongs to a team' });
      }

      // Find team by invite code
      const team = await Team.findOne({ inviteCode: teamCode });
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }

      // Add user to team
      user.team = team._id;
      await user.save();

      res.json({ msg: 'Joined team successfully', team });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;