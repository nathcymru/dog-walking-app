import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { ClientBottomNav } from '../../components/BottomNav';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '5rem' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: '1rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span style={{fontSize: '1.5rem'}}>🐕</span>
              <div>
                <h1 style={{fontSize: '1.25rem', fontWeight: 700}}>PawWalkers</h1>
                <p style={{fontSize: '0.875rem', color: '#666'}}>Welcome back, {user?.full_name}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <ClientBottomNav />
    </div>
  );
}
