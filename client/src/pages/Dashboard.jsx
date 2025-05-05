import React, { useContext, useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { axiosServerInstance } from '../utils/axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (user && user.team) {
      fetchData();
    }
  }, [user, timeRange]);

  const fetchData = async () => {
    try {
      const [activitiesRes, membersRes] = await Promise.all([
        axiosServerInstance.get(`/api/activities?team=${user.team._id}&range=${timeRange}`),
        axiosServerInstance.get(`/api/teams/members?team=${user.team._id}`)
      ]);
      console.log(activitiesRes, membersRes)
      setActivities(activitiesRes.data);
      setTeamMembers(membersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processDataForChart = (type) => {
    const filtered = activities.filter(a => a.type === type);
    const dates = [...new Set(filtered.map(a => new Date(a.timestamp).toLocaleDateString()))];
    
    const dataByDate = dates.map(date => {
      const dateActivities = filtered.filter(a => 
        new Date(a.timestamp).toLocaleDateString() === date
      );
      return dateActivities.reduce((sum, a) => sum + a.count, 0);
    });

    return {
      labels: dates,
      datasets: [{
        label: type.toUpperCase(),
        data: dataByDate,
        backgroundColor: getColorForType(type),
        borderColor: getColorForType(type),
        tension: 0.1
      }]
    };
  };

  const getColorForType = (type) => {
    const colors = {
      commit: 'rgba(54, 162, 235, 0.6)',
      pr: 'rgba(255, 99, 132, 0.6)',
      message: 'rgba(75, 192, 192, 0.6)',
      blocker: 'rgba(255, 159, 64, 0.6)'
    };
    return colors[type] || 'rgba(153, 102, 255, 0.6)';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Team Pulse: {user?.team?.name}</h1>
      
      <div className="mb-6">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last 3 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Commits</h2>
          <Line data={processDataForChart('commit')} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pull Requests</h2>
          <Bar data={processDataForChart('pr')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <Line data={processDataForChart('message')} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Blockers</h2>
          <Bar data={processDataForChart('blocker')} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Activity Distribution</h2>
        <div className="h-64">
          <Pie data={{
            labels: ['Commits', 'PRs', 'Messages', 'Blockers'],
            datasets: [{
              data: [
                activities.filter(a => a.type === 'commit').length,
                activities.filter(a => a.type === 'pr').length,
                activities.filter(a => a.type === 'message').length,
                activities.filter(a => a.type === 'blocker').length
              ],
              backgroundColor: [
                getColorForType('commit'),
                getColorForType('pr'),
                getColorForType('message'),
                getColorForType('blocker')
              ]
            }]
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;