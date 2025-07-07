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
    <div className="dashboard-card">
      <h2 className="dashboard-title">Dashboard</h2>
      {error && <p className="error-message">{error}</p>}
      {user ? (
        <div>
          <p className="welcome-message">Welcome, {user.name || 'Admin User'}!</p>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="welcome-message">Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;