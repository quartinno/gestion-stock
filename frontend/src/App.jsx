import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/products/Index.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .dashboard-container {
            display: flex;
            min-height: 100vh;
            background: linear-gradient(135deg, #e6e6fa 0%, #d8bfd8 100%);
            padding: 1rem;
          }

          .sidebar {
            width: 250px;
            background: #2c3e50;
            color: #ffffff;
            padding: 1.5rem;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 1000;
          }

          .sidebar-header {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            text-align: center;
          }

          .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .sidebar-link {
            display: block;
            padding: 0.75rem 1rem;
            color: #ecf0f1;
            text-decoration: none;
            border-radius: 0.375rem;
            transition: all 0.2s ease;
          }

          .sidebar-link:hover {
            background: #34495e;
            color: #ffffff;
          }

          .sidebar-link.active {
            background: #3498db;
            color: #ffffff;
          }

          .dashboard-content {
            flex: 1;
            margin-left: 250px;
            padding: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .dashboard-card {
            background: #ffffff;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 24rem;
            text-align: center;
          }

          .dashboard-title {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #2c3e50;
          }

          .error-message {
            color: #e74c3c;
            margin-bottom: 1rem;
          }

          .welcome-message {
            margin-bottom: 1.5rem;
            font-size: 1.25rem;
            color: #2c3e50;
          }

          .logout-button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 0.375rem;
            background: #e74c3c;
            color: #ffffff;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .logout-button:hover {
            background: #c0392b;
          }

          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
              transition: transform 0.3s ease;
            }

            .sidebar.open {
              transform: translateX(0);
            }

            .toggle-button {
              display: block;
              position: fixed;
              top: 1rem;
              left: 1rem;
              background: #3498db;
              color: #ffffff;
              border: none;
              padding: 0.5rem;
              border-radius: 0.375rem;
              cursor: pointer;
              z-index: 1100;
              transition: all 0.2s ease;
            }

            .toggle-button:hover {
              background: #2980b9;
            }

            .dashboard-content {
              margin-left: 0;
            }
          }

          @media (max-width: 480px) {
            .dashboard-card {
              padding: 1.5rem;
              max-width: 90%;
            }

            .dashboard-title {
              font-size: 1.5rem;
            }

            .welcome-message {
              font-size: 1rem;
            }

            .logout-button {
              padding: 0.6rem;
              font-size: 0.9375rem;
            }
          }
        `}
      </style>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'business']}>
              <div className="dashboard-container">
                <button
                  className="toggle-button"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                  style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
                >
                  {isSidebarOpen ? '✕' : '☰'}
                </button>
                <Sidebar isOpen={isSidebarOpen} />
                <div className="dashboard-content">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['business']}>
              <div className="dashboard-container">
                <button
                  className="toggle-button"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                  style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
                >
                  {isSidebarOpen ? '✕' : '☰'}
                </button>
                <Sidebar isOpen={isSidebarOpen} />
                <div className="dashboard-content">
                  <Products />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={['business']}>
              <div className="dashboard-container">
                <button
                  className="toggle-button"
                  onClick={toggleSidebar}
                  aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                  style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
                >
                  {isSidebarOpen ? '✕' : '☰'}
                </button>
                <Sidebar isOpen={isSidebarOpen} />
                <div className="dashboard-content">
                  {/* Add Suppliers component here */}
                </div>
              </div>
            </ProtectedRoute>
          }

        <Route path="/" element={<Login />} />
        
      </Routes>
    </>
  );
}

export default App;