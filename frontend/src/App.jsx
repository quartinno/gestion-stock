import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Index';

// Temporary Hello World component to test font
const HelloWorld = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">Hello World</h1>
        <p className="text-2xl text-gray-700 mb-2">QualionRound Font Test</p>
        <p className="text-lg text-gray-600">
          This text should be displayed using the QualionRound font family.
        </p>
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-500">Font weights and sizes:</p>
          <p className="text-xs">Extra Small Text (QualionRound)</p>
          <p className="text-sm">Small Text (QualionRound)</p>
          <p className="text-base">Base Text (QualionRound)</p>
          <p className="text-lg">Large Text (QualionRound)</p>
          <p className="text-xl">Extra Large Text (QualionRound)</p>
          <p className="text-2xl font-semibold">2XL Semibold (QualionRound)</p>
          <p className="text-3xl font-bold">3XL Bold (QualionRound)</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Temporary route for font testing */}
        <Route path="/test" element={<HelloWorld />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Add more routes as components are created */}
        
        <Route path="/" element={<Navigate to="/test" />} />
        <Route path="*" element={<Navigate to="/test" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;