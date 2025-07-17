import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

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