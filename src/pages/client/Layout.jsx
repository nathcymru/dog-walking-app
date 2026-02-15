import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { DogIcon, HomeIcon, CalendarIcon, PawIcon, FileTextIcon, LogOutIcon } from '../../components/Icons';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '4rem' }}>
      <nav className="nav">
        <div className="nav-content container">
          <div className="flex items-center gap-2">
            <DogIcon size={32} />
            <span className="text-xl font-bold">PawWalkers</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.full_name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700">
              <LogOutIcon size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <Outlet />
      </div>

      <div className="mobile-nav">
        <Link to="/client" className={`mobile-nav-item ${isActive('/client') && location.pathname === '/client' ? 'active' : ''}`}>
          <HomeIcon size={24} />
          Dashboard
        </Link>
        <Link to="/client/bookings" className={`mobile-nav-item ${isActive('/client/bookings') ? 'active' : ''}`}>
          <CalendarIcon size={24} />
          Bookings
        </Link>
        <Link to="/client/pets" className={`mobile-nav-item ${isActive('/client/pets') ? 'active' : ''}`}>
          <PawIcon size={24} />
          Pets
        </Link>
        <Link to="/client/billing" className={`mobile-nav-item ${isActive('/client/billing') ? 'active' : ''}`}>
          <FileTextIcon size={24} />
          Billing
        </Link>
      </div>
    </div>
  );
}
