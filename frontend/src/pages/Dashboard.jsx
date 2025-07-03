import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { clearAuthToken } from '../api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user'); 
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        clearAuthToken();
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.name || 'User'}!</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;