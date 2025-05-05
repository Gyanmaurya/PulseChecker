PulseCheck is a developer team activity tracker that visualizes collaboration patterns to prevent burnout and improve productivity. It aggregates data from GitHub, Slack, and manual inputs to provide actionable insights.
![Screenshot (42)](https://github.com/user-attachments/assets/b4d82fc5-50a9-4457-a5c2-deb481a8c559)
✨ Key Features
Real-time activity tracking (commits, PRs, messages)

Burnout risk detection with smart alerts

Team pulse visualization using interactive charts

Cross-platform integration (GitHub + Slack)

Personalized analytics for each team member

Notification system for blockers

🛠 Tech Stack
Frontend
React.js + Vite

Chart.js (Data Visualization)

Tailwind CSS (Styling)

Axios (API Calls)

Backend
Node.js + Express

MongoDB (Database)

JWT (Authentication)

Mongoose (ODM)



🚀 Getting Started
Prerequisites
Node.js (v16+)

MongoDB Atlas account or local instance
Setup backend
cd backend
npm install
# Update .env with your credentials
npm start
Setup frontend
cd client
npm install
npm run dev
Access the app

Frontend: http://localhost:5173

Backend: http://localhost:3008

pulsecheck/
├── backend/
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── app.js          # Express app setup
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Application views
│   │   └── App.jsx     # Main component
└── README.md
