import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ChevronRightIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function ClientBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await api.client.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const filtered = bookings.filter(b => {
    const start = new Date(b.datetime_start);
    return tab === 'upcoming' ? start >= now : start < now;
  });

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

  const getBadgeClass = (status) => {
    if (status === 'scheduled') return 'badge-green';
    if (status === 'completed') return 'badge-blue';
    return 'badge-gray';
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link to="/contact" className="btn btn-primary">Request Booking</Link>
      </div>

      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex gap-4">
          <button
            onClick={() => setTab('upcoming')}
            className={`pb-3 px-1 font-medium ${tab === 'upcoming' ? 'text-primary' : 'text-gray-500'}`}
            style={{ borderBottom: tab === 'upcoming' ? '2px solid #0ea5e9' : 'none' }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab('past')}
            className={`pb-3 px-1 font-medium ${tab === 'past' ? 'text-primary' : 'text-gray-500'}`}
            style={{ borderBottom: tab === 'past' ? '2px solid #0ea5e9' : 'none' }}
          >
            Past
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
            <p className="text-gray-500">No {tab} bookings</p>
          </div>
        ) : (
          filtered.map((booking) => (
            <div key={booking.id} className="card card-hover flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{booking.service_type}</h3>
                  <span className={`badge ${getBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {formatDate(booking.datetime_start)} at {formatTime(booking.datetime_start)}
                </p>
                {booking.pet_names && (
                  <p className="text-sm text-gray-500">{booking.pet_names}</p>
                )}
                {booking.walker_name && (
                  <p className="text-sm text-gray-500">Walker: {booking.walker_name}</p>
                )}
              </div>
              <ChevronRightIcon size={20} style={{ color: '#d1d5db' }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
