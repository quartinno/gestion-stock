# Frontend Implementation Guide

This guide provides step-by-step instructions for implementing the Stock Management Frontend application.

## Step 1: Project Setup and Configuration

1. **Install Tailwind CSS**

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

   Configure Tailwind in `tailwind.config.js`:

   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           primary: '#3B82F6',
           secondary: '#6B7280',
           success: '#10B981',
           warning: '#F59E0B',
           danger: '#EF4444',
         },
       },
     },
     plugins: [],
   }
   ```

2. **Set up CSS files**

   Update `src/index.css`:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer base {
     html {
       font-family: 'Inter', system-ui, sans-serif;
     }
   }
   ```

3. **Install additional dependencies**

   ```bash
   npm install react-router-dom axios react-query formik yup react-icons i18next react-i18next quagga
   ```

## Step 2: Create Project Structure

Create the following directory structure:

```
src/
├── assets/
│   └── images/
├── components/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   └── data/
├── contexts/
├── hooks/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── clients/
│   ├── pos/
│   ├── invoices/
│   └── reports/
├── services/
└── utils/
```

## Step 3: Implement Authentication

1. **Create Authentication Context**

   Create `src/contexts/AuthContext.jsx`:

   ```jsx
   import React, { createContext, useState, useContext, useEffect } from 'react';
   import { login, logout, getCurrentUser } from '../services/authService';

   const AuthContext = createContext();

   export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       const initAuth = async () => {
         try {
           const userData = await getCurrentUser();
           setUser(userData);
         } catch (err) {
           setError(err);
         } finally {
           setLoading(false);
         }
       };

       initAuth();
     }, []);

     const handleLogin = async (credentials) => {
       setLoading(true);
       try {
         const userData = await login(credentials);
         setUser(userData);
         return userData;
       } catch (err) {
         setError(err);
         throw err;
       } finally {
         setLoading(false);
       }
     };

     const handleLogout = async () => {
       setLoading(true);
       try {
         await logout();
         setUser(null);
       } catch (err) {
         setError(err);
       } finally {
         setLoading(false);
       }
     };

     return (
       <AuthContext.Provider
         value={{
           user,
           loading,
           error,
           login: handleLogin,
           logout: handleLogout,
           isAuthenticated: !!user,
         }}
       >
         {children}
       </AuthContext.Provider>
     );
   };

   export const useAuth = () => useContext(AuthContext);
   ```

2. **Create Authentication Service**

   Create `src/services/authService.js`:

   ```javascript
   import axios from 'axios';

   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

   export const login = async (credentials) => {
     try {
       const response = await axios.post(`${API_URL}/auth/login`, credentials);
       const { token, user } = response.data;
       
       // Store token in localStorage
       localStorage.setItem('token', token);
       
       // Set default Authorization header for all requests
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       
       return user;
     } catch (error) {
       console.error('Login error:', error);
       throw error;
     }
   };

   export const logout = async () => {
     try {
       await axios.post(`${API_URL}/auth/logout`);
       
       // Remove token from localStorage
       localStorage.removeItem('token');
       
       // Remove Authorization header
       delete axios.defaults.headers.common['Authorization'];
     } catch (error) {
       console.error('Logout error:', error);
       throw error;
     }
   };

   export const getCurrentUser = async () => {
     try {
       // Get token from localStorage
       const token = localStorage.getItem('token');
       
       if (!token) {
         return null;
       }
       
       // Set default Authorization header
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       
       const response = await axios.get(`${API_URL}/auth/user`);
       return response.data;
     } catch (error) {
       console.error('Get current user error:', error);
       localStorage.removeItem('token');
       delete axios.defaults.headers.common['Authorization'];
       return null;
     }
   };
   ```

3. **Create Login Page**

   Update `src/pages/auth/Login.jsx`:

   ```jsx
   import React, { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../../contexts/AuthContext';

   const Login = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     
     const { login } = useAuth();
     const navigate = useNavigate();
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError('');
       
       try {
         await login({ email, password });
         navigate('/dashboard');
       } catch (err) {
         setError('Invalid email or password');
       } finally {
         setLoading(false);
       }
     };
     
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
           <div>
             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               Sign in to your account
             </h2>
           </div>
           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
             <input type="hidden" name="remember" defaultValue="true" />
             <div className="rounded-md shadow-sm -space-y-px">
               <div>
                 <label htmlFor="email-address" className="sr-only">
                   Email address
                 </label>
                 <input
                   id="email-address"
                   name="email"
                   type="email"
                   autoComplete="email"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                   placeholder="Email address"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <div>
                 <label htmlFor="password" className="sr-only">
                   Password
                 </label>
                 <input
                   id="password"
                   name="password"
                   type="password"
                   autoComplete="current-password"
                   required
                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
             </div>

             {error && (
               <div className="text-red-500 text-sm text-center">{error}</div>
             )}

             <div>
               <button
                 type="submit"
                 disabled={loading}
                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
               >
                 {loading ? 'Signing in...' : 'Sign in'}
               </button>
             </div>
           </form>
         </div>
       </div>
     );
   };

   export default Login;
   ```

4. **Create Protected Route Component**

   Update `src/routes/ProtectedRoute.jsx`:

   ```jsx
   import React from 'react';
   import { Navigate } from 'react-router-dom';
   import PropTypes from 'prop-types';
   import { useAuth } from '../contexts/AuthContext';

   const ProtectedRoute = ({ children, allowedRoles }) => {
     const { user, loading, isAuthenticated } = useAuth();
     
     if (loading) {
       return <div className="flex justify-center items-center h-screen">Loading...</div>;
     }
     
     if (!isAuthenticated) {
       return <Navigate to="/login" />;
     }
     
     if (allowedRoles && !allowedRoles.includes(user.role)) {
       return <Navigate to="/unauthorized" />;
     }
     
     return children;
   };

   ProtectedRoute.propTypes = {
     children: PropTypes.node.isRequired,
     allowedRoles: PropTypes.arrayOf(PropTypes.string),
   };

   export default ProtectedRoute;
   ```

## Step 4: Implement Layout Components

1. **Create Sidebar Component**

   Update `src/components/Sidebar.jsx`:

   ```jsx
   import React from 'react';
   import { Link, useLocation } from 'react-router-dom';
   import PropTypes from 'prop-types';
   import { useAuth } from '../contexts/AuthContext';

   const Sidebar = ({ isOpen }) => {
     const location = useLocation();
     const { user } = useAuth();
     
     const navItems = [
       { name: 'Dashboard', path: '/dashboard', roles: ['super_admin', 'business_admin', 'cashier', 'inventory_manager'] },
       { name: 'Products', path: '/products', roles: ['super_admin', 'business_admin', 'inventory_manager'] },
       { name: 'Clients', path: '/clients', roles: ['super_admin', 'business_admin', 'cashier'] },
       { name: 'Point of Sale', path: '/pos', roles: ['super_admin', 'business_admin', 'cashier'] },
       { name: 'Invoices', path: '/invoices', roles: ['super_admin', 'business_admin', 'cashier'] },
       { name: 'Reports', path: '/reports', roles: ['super_admin', 'business_admin'] },
       { name: 'Subscriptions', path: '/subscriptions', roles: ['super_admin'] },
     ];
     
     return (
       <div className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} overflow-hidden`}>
         <div className="p-4 flex justify-center">
           <h1 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'}`}>Stock Manager</h1>
           <span className={`font-bold text-xl ${isOpen ? 'hidden' : 'block'}`}>SM</span>
         </div>
         <nav className="mt-8">
           <ul>
             {navItems
               .filter(item => item.roles.includes(user?.role))
               .map((item) => (
                 <li key={item.path}>
                   <Link
                     to={item.path}
                     className={`flex items-center py-3 px-4 hover:bg-gray-700 ${
                       location.pathname === item.path ? 'bg-gray-700' : ''
                     }`}
                   >
                     <span className={`${isOpen ? 'ml-2' : 'ml-0'}`}>{item.name}</span>
                   </Link>
                 </li>
               ))}
           </ul>
         </nav>
       </div>
     );
   };

   Sidebar.propTypes = {
     isOpen: PropTypes.bool.isRequired,
   };

   export default Sidebar;
   ```

2. **Create Header Component**

   Create `src/components/layout/Header.jsx`:

   ```jsx
   import React from 'react';
   import { useAuth } from '../../contexts/AuthContext';
   import PropTypes from 'prop-types';

   const Header = ({ toggleSidebar }) => {
     const { user, logout } = useAuth();
     
     return (
       <header className="bg-white shadow h-16 flex items-center justify-between px-4">
         <div className="flex items-center">
           <button
             onClick={toggleSidebar}
             className="text-gray-500 focus:outline-none focus:text-gray-700"
           >
             <svg
               className="h-6 w-6"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth="2"
                 d="M4 6h16M4 12h16M4 18h16"
               />
             </svg>
           </button>
         </div>
         
         <div className="flex items-center">
           <div className="relative">
             <button className="flex items-center text-gray-700 focus:outline-none">
               <span className="mr-2">{user?.name}</span>
               <svg
                 className="h-5 w-5 text-gray-500"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth="2"
                   d="M19 9l-7 7-7-7"
                 />
               </svg>
             </button>
             
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
               <button
                 onClick={logout}
                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
               >
                 Sign out
               </button>
             </div>
           </div>
         </div>
       </header>
     );
   };

   Header.propTypes = {
     toggleSidebar: PropTypes.func.isRequired,
   };

   export default Header;
   ```

3. **Create Main Layout Component**

   Create `src/components/layout/MainLayout.jsx`:

   ```jsx
   import React, { useState } from 'react';
   import PropTypes from 'prop-types';
   import Sidebar from '../Sidebar';
   import Header from './Header';

   const MainLayout = ({ children }) => {
     const [sidebarOpen, setSidebarOpen] = useState(true);
     
     const toggleSidebar = () => {
       setSidebarOpen(!sidebarOpen);
     };
     
     return (
       <div className="flex h-screen bg-gray-100">
         <Sidebar isOpen={sidebarOpen} />
         <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
           <Header toggleSidebar={toggleSidebar} />
           <main className="flex-1 overflow-y-auto p-6">
             {children}
           </main>
         </div>
       </div>
     );
   };

   MainLayout.propTypes = {
     children: PropTypes.node.isRequired,
   };

   export default MainLayout;
   ```

## Step 5: Implement Dashboard

Update `src/pages/Dashboard.jsx`:

```jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Products</h2>
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-sm text-gray-500">Total products</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Low Stock</h2>
          <p className="text-3xl font-bold text-warning">0</p>
          <p className="text-sm text-gray-500">Products below threshold</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Expiring Soon</h2>
          <p className="text-3xl font-bold text-danger">0</p>
          <p className="text-sm text-gray-500">Products expiring in 7 days</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Today's Sales</h2>
          <p className="text-3xl font-bold text-success">$0.00</p>
          <p className="text-sm text-gray-500">Total sales today</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="4">
                    No recent sales
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Client Credits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="3">
                    No client credits
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
```

## Step 6: Set Up Routing

Update `src/App.jsx`:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Step 7: Implement Product Management

1. **Create Product Service**

   Create `src/services/productService.js`:

   ```javascript
   import axios from 'axios';

   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

   export const getProducts = async (filters = {}) => {
     try {
       const response = await axios.get(`${API_URL}/products`, { params: filters });
       return response.data;
     } catch (error) {
       console.error('Error fetching products:', error);
       throw error;
     }
   };

   export const getProduct = async (id) => {
     try {
       const response = await axios.get(`${API_URL}/products/${id}`);
       return response.data;
     } catch (error) {
       console.error(`Error fetching product ${id}:`, error);
       throw error;
     }
   };

   export const createProduct = async (product) => {
     try {
       const response = await axios.post(`${API_URL}/products`, product);
       return response.data;
     } catch (error) {
       console.error('Error creating product:', error);
       throw error;
     }
   };

   export const updateProduct = async (id, product) => {
     try {
       const response = await axios.put(`${API_URL}/products/${id}`, product);
       return response.data;
     } catch (error) {
       console.error(`Error updating product ${id}:`, error);
       throw error;
     }
   };

   export const deleteProduct = async (id) => {
     try {
       const response = await axios.delete(`${API_URL}/products/${id}`);
       return response.data;
     } catch (error) {
       console.error(`Error deleting product ${id}:`, error);
       throw error;
     }
   };

   export const scanBarcode = async (barcode) => {
     try {
       const response = await axios.get(`${API_URL}/products/barcode/${barcode}`);
       return response.data;
     } catch (error) {
       console.error(`Error scanning barcode ${barcode}:`, error);
       throw error;
     }
   };
   ```

2. **Create Product List Page**

   Update `src/pages/products/Index.jsx`:

   ```jsx
   import React, { useState, useEffect } from 'react';
   import { Link } from 'react-router-dom';
   import MainLayout from '../../components/layout/MainLayout';
   import { getProducts } from '../../services/productService';

   const ProductList = () => {
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [search, setSearch] = useState('');
     const [filter, setFilter] = useState('all');
     
     useEffect(() => {
       const fetchProducts = async () => {
         try {
           const data = await getProducts();
           setProducts(data);
         } catch (err) {
           setError('Failed to fetch products');
         } finally {
           setLoading(false);
         }
       };
       
       fetchProducts();
     }, []);
     
     const filteredProducts = products
       .filter(product => {
         if (filter === 'low_stock') {
           return product.quantity <= product.minStockThreshold;
         } else if (filter === 'out_of_stock') {
           return product.quantity === 0;
         } else if (filter === 'expiring_soon') {
           // Check if product is expiring within 7 days
           if (!product.expirationDate) return false;
           const expirationDate = new Date(product.expirationDate);
           const today = new Date();
           const diffTime = expirationDate - today;
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           return diffDays <= 7 && diffDays >= 0;
         }
         return true;
       })
       .filter(product => {
         if (!search) return true;
         return (
           product.name.toLowerCase().includes(search.toLowerCase()) ||
           product.barcode.includes(search) ||
           product.category.toLowerCase().includes(search.toLowerCase())
         );
       });
     
     return (
       <MainLayout>
         <div className="mb-6 flex justify-between items-center">
           <h1 className="text-3xl font-bold text-gray-900">Products</h1>
           <Link
             to="/products/new"
             className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
           >
             Add Product
           </Link>
         </div>
         
         <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
             <div className="flex-1">
               <input
                 type="text"
                 placeholder="Search products..."
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
             </div>
             <div>
               <select
                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
               >
                 <option value="all">All Products</option>
                 <option value="low_stock">Low Stock</option>
                 <option value="out_of_stock">Out of Stock</option>
                 <option value="expiring_soon">Expiring Soon</option>
               </select>
             </div>
           </div>
           
           {loading ? (
             <div className="p-4 text-center">Loading products...</div>
           ) : error ? (
             <div className="p-4 text-center text-red-500">{error}</div>
           ) : (
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Name
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Barcode
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Category
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Price
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Stock
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Expiration
                     </th>
                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Actions
                     </th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {filteredProducts.length === 0 ? (
                     <tr>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="7">
                         No products found
                       </td>
                     </tr>
                   ) : (
                     filteredProducts.map((product) => (
                       <tr key={product.id}>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900">{product.name}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-500">{product.barcode}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-500">{product.category}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-500">${product.unitPrice.toFixed(2)}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className={`text-sm ${
                             product.quantity <= product.minStockThreshold
                               ? 'text-red-500 font-medium'
                               : 'text-gray-500'
                           }`}>
                             {product.quantity}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-500">
                             {product.expirationDate
                               ? new Date(product.expirationDate).toLocaleDateString()
                               : 'N/A'}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <Link
                             to={`/products/${product.id}/edit`}
                             className="text-primary hover:text-blue-700 mr-4"
                           >
                             Edit
                           </Link>
                           <button
                             className="text-red-500 hover:text-red-700"
                             onClick={() => {
                               // Handle delete
                             }}
                           >
                             Delete
                           </button>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           )}
         </div>
       </MainLayout>
     );
   };

   export default ProductList;
   ```

## Step 8: Update App.jsx with All Routes

Update `src/App.jsx` to include all routes:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/Index';
// Import other pages as they are created

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['super_admin', 'business_admin', 'inventory_manager']}>
              <ProductList />
            </ProtectedRoute>
          } />
          
          {/* Add more routes as components are created */}
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Next Steps

Continue implementing the remaining components and pages following the same pattern:

1. Create service files for API communication
2. Create page components with appropriate layouts
3. Add routes to App.jsx
4. Implement form validation and error handling
5. Add barcode scanning functionality for product management and POS
6. Implement internationalization for multilingual support

## Vite Commands

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

## Development Tips

1. Use React Query for efficient data fetching and caching
2. Implement proper error handling for API requests
3. Use Formik and Yup for form validation
4. Create reusable components for common UI elements
5. Follow the established design system for consistent styling
6. Write unit tests for critical components
7. Use React Context for global state management
8. Implement proper loading states and error boundaries