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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ion-background-color)', paddingBottom: '5rem' }}>
      {/* Header */}
      <header style={{
        background: 'var(--ion-toolbar-background, var(--ion-background-color))',
        borderBottom: '1px solid var(--ion-border-color, #c8c7cc)',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
      }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span style={{fontSize: '2rem'}}>🐕</span>
              <div>
                <h1 style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--ion-text-color)'}}>PawWalkers Admin</h1>
                <p style={{fontSize: '0.875rem', color: 'var(--ion-color-medium)'}}>Logged in as {user?.full_name}</p>
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
