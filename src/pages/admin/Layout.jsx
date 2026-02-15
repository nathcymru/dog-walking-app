import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { DogIcon, UsersIcon, PawIcon, CalendarIcon, AlertIcon, LogOutIcon, LayoutDashboardIcon } from '../../components/Icons';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '1.5rem', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div className="flex items-center gap-2 mb-8">
          <DogIcon size={32} />
          <span className="text-xl font-bold">PawWalkers Admin</span>
        </div>

        <nav className="space-y-2">
          <Link to="/admin" className={`flex items-center gap-3 p-3 rounded ${isActive('/admin') && location.pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            <LayoutDashboardIcon size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/clients" className={`flex items-center gap-3 p-3 rounded ${isActive('/admin/clients') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            <UsersIcon size={20} />
            <span>Clients</span>
          </Link>
          <Link to="/admin/pets" className={`flex items-center gap-3 p-3 rounded ${isActive('/admin/pets') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            <PawIcon size={20} />
            <span>Pets</span>
          </Link>
          <Link to="/admin/bookings" className={`flex items-center gap-3 p-3 rounded ${isActive('/admin/bookings') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            <CalendarIcon size={20} />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/incidents" className={`flex items-center gap-3 p-3 rounded ${isActive('/admin/incidents') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
            <AlertIcon size={20} />
            <span>Incidents</span>
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
          <p className="text-sm text-gray-400 mb-2">{user?.full_name}</p>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white">
            <LogOutIcon size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
