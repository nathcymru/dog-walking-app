import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, PawIcon, FileTextIcon, AlertIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function ClientDashboard() {
  const [data, setData] = useState({ nextBooking: null, unpaidInvoices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [bookings, invoices] = await Promise.all([
        api.client.getBookings(),
        api.client.getInvoices(),
      ]);

      const now = new Date();
      const upcoming = bookings
        .filter(b => new Date(b.datetime_start) > now && b.status === 'scheduled')
        .sort((a, b) => new Date(a.datetime_start) - new Date(b.datetime_start));

      const unpaid = invoices.filter(inv => inv.status === 'unpaid');

      setData({ nextBooking: upcoming[0] || null, unpaidInvoices: unpaid });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {data.unpaidInvoices.length > 0 && (
        <div className="alert alert-warning">
          <div className="flex items-start gap-3">
            <AlertIcon size={20} />
            <div className="flex-1">
              <p className="font-medium">
                {data.unpaidInvoices.length} unpaid invoice{data.unpaidInvoices.length !== 1 ? 's' : ''}
              </p>
              <Link to="/client/billing" className="text-sm underline">View billing →</Link>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Next Booking</h2>
        {data.nextBooking ? (
          <div className="card" style={{ backgroundColor: '#f9fafb' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{data.nextBooking.service_type}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(data.nextBooking.datetime_start)} at {formatTime(data.nextBooking.datetime_start)}
                </p>
              </div>
              <span className="badge badge-green">Scheduled</span>
            </div>
            {data.nextBooking.pet_names && (
              <p className="text-sm text-gray-600">Pets: {data.nextBooking.pet_names}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming bookings</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/client/bookings" className="card card-hover">
          <CalendarIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.75rem' }} />
          <h3 className="font-semibold mb-1">My Bookings</h3>
          <p className="text-sm text-gray-600">View all your scheduled walks</p>
        </Link>

        <Link to="/client/pets" className="card card-hover">
          <PawIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.75rem' }} />
          <h3 className="font-semibold mb-1">My Pets</h3>
          <p className="text-sm text-gray-600">View your pet profiles</p>
        </Link>

        <Link to="/client/billing" className="card card-hover">
          <FileTextIcon size={32} style={{ color: '#0ea5e9', marginBottom: '0.75rem' }} />
          <h3 className="font-semibold mb-1">Billing</h3>
          <p className="text-sm text-gray-600">View invoices and payments</p>
        </Link>
      </div>
    </div>
  );
}
