import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <nav className={`sidebar ${isOpen && window.innerWidth <= 768 ? 'open' : ''}`}>
      <div className="sidebar-header">My App</div>
      <div className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/products"
          className={`sidebar-link ${location.pathname === '/products' ? 'active' : ''}`}
        >
          Products
        </Link>
        <Link
          to="/suppliers"
          className={`sidebar-link ${location.pathname === '/suppliers' ? 'active' : ''}`}
        >
          Suppliers
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;