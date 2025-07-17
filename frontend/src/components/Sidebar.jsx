import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Sidebar({ isOpen }) {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/products',
      label: 'Products',
      icon: '📦',
      hasSubmenu: true,
      submenu: [
        { path: '/products', label: 'All Products', icon: '📋' },
        { path: '/products/add', label: 'Add Product', icon: '➕' },
        { path: '/products/categories', label: 'Categories', icon: '🏷️' }
      ]
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: '🛒'
    },
    {
      path: '/suppliers',
      label: 'Suppliers',
      icon: '🚚'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '📈'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️'
    }
  ];

  return (
    <>
      <style>
        {`
          .modern-sidebar {
            width: 280px;
            background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
            color: #ffffff;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
            box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
          }

          .modern-sidebar.closed {
            transform: translateX(-100%);
          }

          .sidebar-brand {
            padding: 2rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .brand-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .brand-name {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.02em;
          }

          .sidebar-menu {
            flex: 1;
            padding: 1.5rem 0;
            overflow-y: auto;
          }

          .menu-item {
            margin-bottom: 0.25rem;
          }

          .menu-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.875rem 1.5rem;
            color: #cbd5e1;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            font-weight: 500;
          }

          .menu-link:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
          }

          .menu-link.active {
            color: #ffffff;
            background: rgba(99, 102, 241, 0.2);
          }

          .menu-link.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #6366f1;
          }

          .menu-icon {
            font-size: 1.25rem;
            width: 24px;
            text-align: center;
          }

          .menu-label {
            flex: 1;
          }

          .submenu-toggle {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0.25rem;
            transition: transform 0.3s ease;
          }

          .submenu-toggle.open {
            transform: rotate(90deg);
          }

          .submenu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .submenu.open {
            max-height: 200px;
          }

          .submenu-item {
            padding-left: 3.5rem;
            font-size: 0.875rem;
          }

          .sidebar-footer {
            padding: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            margin-bottom: 1rem;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .user-details {
            flex: 1;
          }

          .user-name {
            font-weight: 600;
            font-size: 0.875rem;
          }

          .user-role {
            font-size: 0.75rem;
            color: #94a3b8;
          }

          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          @media (max-width: 768px) {
            .modern-sidebar {
              transform: translateX(-100%);
            }

            .modern-sidebar.open {
              transform: translateX(0);
            }

            .sidebar-overlay.show {
              display: block;
            }
          }
        `}
      </style>
      
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} />
      
      <nav className={`modern-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">📊</div>
          <div className="brand-name">StockPro</div>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div key={item.path} className="menu-item">
              {item.hasSubmenu ? (
                <>
                  <div
                    className={`menu-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                    <button className={`submenu-toggle ${isProductsOpen ? 'open' : ''}`}>
                      ▶
                    </button>
                  </div>
                  <div className={`submenu ${isProductsOpen ? 'open' : ''}`}>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`menu-link submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
                      >
                        <span className="menu-icon">{subItem.icon}</span>
                        <span className="menu-label">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div className="user-details">
              <div className="user-name">John Doe</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;