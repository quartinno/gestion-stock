import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const response = await api.post('/api/login', { email, password });
      const { token, role } = response.data; 
      setAuthToken(token);
      localStorage.setItem('token', token); 
      localStorage.setItem('userRole', role); 
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #e0e7ff 0%, #e9d5ff 100%);
            padding: 1rem;
          }

          .login-card {
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 35rem;
            animation: fadeIn 0.5s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .login-title {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 2rem;
            text-align: center;
            color: #1e293b;
            letter-spacing: -0.02em;
          }

          .error-message {
            color: #dc2626;
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            background: #fee2e2;
            padding: 0.5rem;
            border-radius: 0.375rem;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .login-input {
            width: 100%;
            padding: 0.75rem 1rem;
            margin-bottom: 1.25rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            font-size: 1rem;
            color: #1e293b;
            background: #f8fafc;
            transition: all 0.3s ease;
          }

          .login-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            background: #ffffff;
          }

          .login-input::placeholder {
            color: #94a3b8;
          }

          .login-button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 0.5rem;
            background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .login-button:hover {
            background: linear-gradient(90deg, #4f46e5 0%, #4338ca 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
          }

          .login-button:active {
            transform: translateY(0);
            box-shadow: none;
          }

          .login-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 1.5rem;
              max-width: 90%;
            }

            .login-title {
              font-size: 1.5rem;
            }

            .login-input {
              padding: 0.6rem;
              font-size: 0.9375rem;
            }

            .login-button {
              padding: 0.6rem;
              font-size: 0.9375rem;
            }
          }
        `}
      </style>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="login-input"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
              required
            />
            <button
              type="submit"
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;