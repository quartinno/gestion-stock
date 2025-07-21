import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Index';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import SelectedPlan from './pages/SelectedPlan';
import AccountSetup from './pages/AccountSetup';
import CheckoutPay from './pages/CheckoutPay';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Main page with header */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/select-plan/:planId" element={<SelectedPlan />} />
        <Route path="/account-setup/:planId" element={<AccountSetup />} />
        <Route path="/checkout/:planId" element={<CheckoutPay />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Add more routes as components are created */}
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;