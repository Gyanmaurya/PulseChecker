// User Profile Schema
const userProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skills: [String],
    github: String,
    slackId: String,
    avatar: String
  });