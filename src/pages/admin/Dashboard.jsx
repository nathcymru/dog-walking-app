import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { DogIcon, UsersIcon, PawIcon, FileTextIcon, LogOutIcon, LayoutDashboardIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await api.admin.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav className="nav">
        <div className="nav-content container">
          <div className="flex items-center gap-2">
            <DogIcon size={32} />
            <span className="text-xl font-bold">PawWalkers Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.full_name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700">
              <LogOutIcon size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="card">
              <UsersIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.5rem' }} />
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold">{stats?.clients || 0}</p>
            </div>

            <div className="card">
              <PawIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.5rem' }} />
              <p className="text-sm text-gray-600">Total Pets</p>
              <p className="text-3xl font-bold">{stats?.pets || 0}</p>
            </div>

            <div className="card">
              <LayoutDashboardIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.5rem' }} />
              <p className="text-sm text-gray-600">Today's Bookings</p>
              <p className="text-3xl font-bold">{stats?.todayBookings || 0}</p>
            </div>

            <div className="card">
              <FileTextIcon size={32} style={{ color: '#ef4444', marginBottom: '0.5rem' }} />
              <p className="text-sm text-gray-600">Unpaid Invoices</p>
              <p className="text-3xl font-bold">{stats?.unpaidInvoices || 0}</p>
            </div>
          </div>

          {stats?.todayBookingsList && stats.todayBookingsList.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                {stats.todayBookingsList.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3" style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div>
                      <p className="font-medium">{booking.service_type}</p>
                      <p className="text-sm text-gray-600">{booking.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(booking.datetime_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-600">{booking.walker_name || 'Unassigned'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card" style={{ backgroundColor: '#eff6ff' }}>
            <h3 className="font-semibold mb-2">Admin Panel Access</h3>
            <p className="text-gray-600 mb-4">
              Use Cloudflare D1 Console to manage clients, pets, bookings, and invoices directly in the database.
            </p>
            <p className="text-sm text-gray-600">
              Go to: Cloudflare Dashboard → D1 → dog-walking-db → Console
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
