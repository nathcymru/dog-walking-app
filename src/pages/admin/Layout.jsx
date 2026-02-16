import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { AdminBottomNav } from '../../components/BottomNav';

export default function AdminLayout() {
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
        background: 'linear-gradient(135deg, var(--pastel-sky) 0%, var(--pastel-lavender) 100%)',
        borderBottom: '1px solid var(--pastel-sky-dark)',
        padding: 'var(--space-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span style={{fontSize: '2rem'}}>🐕</span>
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-900)'}}>PawWalkers Admin</h1>
                <p style={{fontSize: '0.875rem', color: 'var(--gray-700)'}}>Logged in as {user?.full_name}</p>
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
      <AdminBottomNav />
    </div>
  );
}
