const Activity = require('../models/Activity');
const User = require('../models/User');

// Generate random activity data for a team
const simulateTeamActivity = async (teamId) => {
  const members = await User.find({ team: teamId });
  if (members.length === 0) return;

  const activities = [];
  const now = new Date();
  
  // Generate data for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    
    // Each member has random activity
    for (const member of members) {
      // Commits (0-10 per day)
      const commitCount = Math.floor(Math.random() * 11);
      if (commitCount > 0) {
        activities.push({
          type: 'commit',
          user: member._id,
          team: teamId,
          count: commitCount,
          timestamp: date
        });
      }

      // PRs (0-3 per day)
      const prCount = Math.floor(Math.random() * 4);
      if (prCount > 0) {
        activities.push({
          type: 'pr',
          user: member._id,
          team: teamId,
          count: prCount,
          timestamp: date
        });
      }

      // Messages (0-20 per day)
      const messageCount = Math.floor(Math.random() * 21);
      if (messageCount > 0) {
        activities.push({
          type: 'message',
          user: member._id,
          team: teamId,
          count: messageCount,
          timestamp: date
        });
      }

      // Blockers (10% chance per day)
      if (Math.random() < 0.1) {
        activities.push({
          type: 'blocker',
          user: member._id,
          team: teamId,
          message: 'Need help with implementation',
          timestamp: date
        });
      }
    }
  }

  await Activity.insertMany(activities);
  console.log(`Generated ${activities.length} activities for team ${teamId}`);
};

module.exports = { simulateTeamActivity };