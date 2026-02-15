import { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState(getEmptyForm());

  useEffect(() => {
    loadData();
  }, []);

  function getEmptyForm() {
    return {
      client_id: '',
      pet_ids: [],
      service_type: 'Solo Walk',
      datetime_start: '',
      datetime_end: '',
      time_window_start: '',
      time_window_end: '',
      recurrence: 'One-off',
      walker_name: '',
      status: 'approved',
      notes: '',
      admin_comment: '',
    };
  }

  async function loadData() {
    try {
      const [bookingsData, clientsData, petsData] = await Promise.all([
        api.admin.getBookings(),
        api.admin.getClients(),
        api.admin.getPets(),
      ]);
      setBookings(bookingsData);
      setClients(clientsData);
      setPets(petsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingBooking(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  }

  async function openEditModal(booking) {
    setEditingBooking(booking);
    
    // Load full booking details including pet IDs
    try {
      const fullBooking = await api.admin.getBooking(booking.id);
      setFormData({
        client_id: fullBooking.client_id,
        pet_ids: fullBooking.pet_ids || [],
        service_type: fullBooking.service_type,
        datetime_start: fullBooking.datetime_start.slice(0, 16), // Format for datetime-local
        datetime_end: fullBooking.datetime_end.slice(0, 16),
        time_window_start: fullBooking.time_window_start || '',
        time_window_end: fullBooking.time_window_end || '',
        recurrence: fullBooking.recurrence || 'One-off',
        walker_name: fullBooking.walker_name || '',
        status: fullBooking.status,
        notes: fullBooking.notes || '',
        admin_comment: fullBooking.admin_comment || '',
      });
      setShowModal(true);
    } catch (error) {
      alert('Failed to load booking details');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingBooking) {
        await api.admin.updateBooking(editingBooking.id, formData);
      } else {
        await api.admin.createBooking(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this booking?')) return;
    try {
      await api.admin.deleteBooking(id);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleStatusChange(id, newStatus, comment = '') {
    try {
      const booking = bookings.find(b => b.id === id);
      await api.admin.updateBooking(id, {
        ...booking,
        status: newStatus,
        admin_comment: comment,
      });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const handlePetToggle = (petId) => {
    if (formData.pet_ids.includes(petId)) {
      setFormData({ ...formData, pet_ids: formData.pet_ids.filter(id => id !== petId) });
    } else {
      setFormData({ ...formData, pet_ids: [...formData.pet_ids, petId] });
    }
  };

  const clientPets = pets.filter(p => p.client_id === parseInt(formData.client_id));

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getBadgeClass = (status) => {
    if (status === 'approved') return 'badge-green';
    if (status === 'pending') return 'badge-blue';
    if (status === 'completed') return 'badge-gray';
    if (status === 'cancelled') return 'badge-gray';
    if (status === 'denied') return 'badge-gray';
    return 'badge-gray';
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon size={20} /> Create Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setFilter('all')} 
          className={`pb-2 px-3 ${filter === 'all' ? 'text-primary font-medium' : 'text-gray-600'}`}
          style={{ borderBottom: filter === 'all' ? '2px solid #0ea5e9' : 'none' }}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('pending')} 
          className={`pb-2 px-3 ${filter === 'pending' ? 'text-primary font-medium' : 'text-gray-600'}`}
          style={{ borderBottom: filter === 'pending' ? '2px solid #0ea5e9' : 'none' }}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('approved')} 
          className={`pb-2 px-3 ${filter === 'approved' ? 'text-primary font-medium' : 'text-gray-600'}`}
          style={{ borderBottom: filter === 'approved' ? '2px solid #0ea5e9' : 'none' }}
        >
          Approved
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={`pb-2 px-3 ${filter === 'completed' ? 'text-primary font-medium' : 'text-gray-600'}`}
          style={{ borderBottom: filter === 'completed' ? '2px solid #0ea5e9' : 'none' }}
        >
          Completed
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Date/Time</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Client</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Pet(s)</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Walker</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{formatDateTime(booking.datetime_start)}</td>
                <td style={{ padding: '1rem' }}>{booking.client_name}</td>
                <td style={{ padding: '1rem' }}>{booking.pet_names || 'None'}</td>
                <td style={{ padding: '1rem' }}>{booking.service_type}</td>
                <td style={{ padding: '1rem' }}>{booking.walker_name || 'Unassigned'}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${getBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(booking.id, 'approved')} 
                        className="btn btn-primary" 
                        style={{ marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          const comment = prompt('Reason for denial (optional):');
                          if (comment !== null) handleStatusChange(booking.id, 'denied', comment);
                        }} 
                        className="btn" 
                        style={{ backgroundColor: '#f59e0b', color: 'white', marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                      >
                        Deny
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => openEditModal(booking)} 
                    className="btn btn-primary" 
                    style={{ marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(booking.id)} 
                    className="btn" 
                    style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', width: '100%' }}>
            <h2 className="text-2xl font-bold mb-6">{editingBooking ? 'Edit Booking' : 'Create New Booking'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client & Pets */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Client & Pets</h3>
              <div className="form-group">
                <label className="form-label">Client *</label>
                <select 
                  className="form-input" 
                  value={formData.client_id} 
                  onChange={e => setFormData({...formData, client_id: e.target.value, pet_ids: []})} 
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              {formData.client_id && (
                <div className="form-group">
                  <label className="form-label">Select Pet(s) *</label>
                  {clientPets.length === 0 ? (
                    <p className="text-sm text-gray-500">No pets registered for this client</p>
                  ) : (
                    <div className="space-y-2">
                      {clientPets.map(pet => (
                        <label key={pet.id} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.pet_ids.includes(pet.id)} 
                            onChange={() => handlePetToggle(pet.id)} 
                          />
                          <span>{pet.name} ({pet.breed})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Service Details */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Service Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Service Type *</label>
                  <select 
                    className="form-input" 
                    value={formData.service_type} 
                    onChange={e => setFormData({...formData, service_type: e.target.value})} 
                    required
                  >
                    <option value="Solo Walk">Solo Walk</option>
                    <option value="Pair Walk">Pair Walk</option>
                    <option value="Group Walk">Group Walk</option>
                    <option value="Puppy Visit">Puppy Visit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Recurrence</label>
                  <select 
                    className="form-input" 
                    value={formData.recurrence} 
                    onChange={e => setFormData({...formData, recurrence: e.target.value})}
                  >
                    <option value="One-off">One-off</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Date & Time</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Date/Time *</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.datetime_start} 
                    onChange={e => setFormData({...formData, datetime_start: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date/Time *</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.datetime_end} 
                    onChange={e => setFormData({...formData, datetime_end: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Window Start</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={formData.time_window_start} 
                    onChange={e => setFormData({...formData, time_window_start: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time Window End</label>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={formData.time_window_end} 
                    onChange={e => setFormData({...formData, time_window_end: e.target.value})} 
                  />
                </div>
              </div>

              {/* Assignment & Status */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Assignment & Status</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Walker Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.walker_name} 
                    onChange={e => setFormData({...formData, walker_name: e.target.value})} 
                    placeholder="Assign walker..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select 
                    className="form-input" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})} 
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Notes</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Client Notes</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3" 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                    placeholder="Notes from client..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Comment</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3" 
                    value={formData.admin_comment} 
                    onChange={e => setFormData({...formData, admin_comment: e.target.value})} 
                    placeholder="Internal notes or reason for denial..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
