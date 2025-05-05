import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { axiosServerInstance } from '../utils/axios';

const TeamSetup = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    teamCode: '',
    createNew: false,
    teamName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.createNew) {
        // Create new team
        await axiosServerInstance.post('/api/teams/create-new-team', { name: formData.teamName });
      } else {
        // Join existing team
        await axiosServerInstance.put('/api/teams/join', { teamCode: formData.teamCode });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Team Setup</h1>
      
      <div className="bg-white p-6 rounded shadow">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 ${!formData.createNew ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFormData({ ...formData, createNew: false })}
          >
            Join Existing Team
          </button>
          <button
            className={`flex-1 py-2 ${formData.createNew ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFormData({ ...formData, createNew: true })}
          >
            Create New Team
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!formData.createNew ? (
            <div className="mb-4">
              <label className="block mb-2">Team Invite Code</label>
              <input
                type="text"
                name="teamCode"
                value={formData.teamCode}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block mb-2">Team Name</label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {formData.createNew ? 'Create Team' : 'Join Team'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamSetup;