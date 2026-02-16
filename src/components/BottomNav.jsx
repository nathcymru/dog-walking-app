import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, PawIcon, FileTextIcon, UsersIcon, AlertIcon, LayoutDashboardIcon } from './Icons';

// Bottom Navigation for Client Portal (top-level)
export function ClientBottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        <Link to="/client" className={`bottom-nav-item ${isActive('/client') && location.pathname === '/client' ? 'active' : ''}`}>
          <LayoutDashboardIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Dashboard</span>
        </Link>
        <Link to="/client/bookings" className={`bottom-nav-item ${isActive('/client/bookings') ? 'active' : ''}`}>
          <CalendarIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Bookings</span>
        </Link>
        <Link to="/client/pets" className={`bottom-nav-item ${isActive('/client/pets') ? 'active' : ''}`}>
          <PawIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Pets</span>
        </Link>
        <Link to="/client/billing" className={`bottom-nav-item ${isActive('/client/billing') ? 'active' : ''}`}>
          <FileTextIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Billing</span>
        </Link>
      </div>
    </nav>
  );
}

// Bottom Navigation for Admin Portal (top-level)
export function AdminBottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        <Link to="/admin" className={`bottom-nav-item ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}>
          <LayoutDashboardIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Dashboard</span>
        </Link>
        <Link to="/admin/clients" className={`bottom-nav-item ${isActive('/admin/clients') ? 'active' : ''}`}>
          <UsersIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Clients</span>
        </Link>
        <Link to="/admin/pets" className={`bottom-nav-item ${isActive('/admin/pets') ? 'active' : ''}`}>
          <PawIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Pets</span>
        </Link>
        <Link to="/admin/bookings" className={`bottom-nav-item ${isActive('/admin/bookings') ? 'active' : ''}`}>
          <CalendarIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Bookings</span>
        </Link>
        <Link to="/admin/incidents" className={`bottom-nav-item ${isActive('/admin/incidents') ? 'active' : ''}`}>
          <AlertIcon size={24} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Incidents</span>
        </Link>
      </div>
    </nav>
  );
}

// Context Menu for deeper pages (adapts based on context)
export function ContextBottomNav({ items, currentSection }) {
  return (
    <nav className="bottom-nav context-menu">
      <div className="bottom-nav-container">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`bottom-nav-item ${currentSection === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
