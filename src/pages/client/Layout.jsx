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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)', paddingBottom: '5rem' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--gray-200)',
        padding: 'var(--space-md) var(--space-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span style={{fontSize: '1.5rem'}}>🐕</span>
              <div>
                <h1 style={{fontSize: '1.25rem', fontWeight: 700}}>PawWalkers</h1>
                <p style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>Welcome back, {user?.full_name}</p>
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
