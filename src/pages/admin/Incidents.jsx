import { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function AdminIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());

  useEffect(() => {
    loadData();
  }, []);

  function getEmptyForm() {
    return {
      incident_datetime: '',
      incident_type: 'Injury',
      related_pet_id: '',
      related_booking_id: '',
      location: '',
      summary: '',
      actions_taken: '',
      owner_informed: false,
      attachments: '',
      follow_up_required: false,
      follow_up_notes: '',
    };
  }

  async function loadData() {
    try {
      const [incidentsData, petsData, bookingsData] = await Promise.all([
        api.admin.getIncidents(),
        api.admin.getPets(),
        api.admin.getBookings(),
      ]);
      setIncidents(incidentsData);
      setPets(petsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingIncident(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  }

  async function openEditModal(incident) {
    setEditingIncident(incident);
    try {
      const fullIncident = await api.admin.getIncident(incident.id);
      setFormData({
        incident_datetime: fullIncident.incident_datetime.slice(0, 16),
        incident_type: fullIncident.incident_type,
        related_pet_id: fullIncident.related_pet_id,
        related_booking_id: fullIncident.related_booking_id || '',
        location: fullIncident.location || '',
        summary: fullIncident.summary,
        actions_taken: fullIncident.actions_taken,
        owner_informed: Boolean(fullIncident.owner_informed),
        attachments: fullIncident.attachments || '',
        follow_up_required: Boolean(fullIncident.follow_up_required),
        follow_up_notes: fullIncident.follow_up_notes || '',
      });
      setShowModal(true);
    } catch (error) {
      alert('Failed to load incident details');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingIncident) {
        await api.admin.updateIncident(editingIncident.id, formData);
      } else {
        await api.admin.createIncident(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this incident report?')) return;
    try {
      await api.admin.deleteIncident(id);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIncidentColor = (type) => {
    const colors = {
      'Injury': '#ef4444',
      'Illness': '#f59e0b',
      'Dog altercation': '#f59e0b',
      'Human incident': '#ef4444',
      'Escape': '#ef4444',
      'Property damage': '#f59e0b',
      'Other': '#6b7280',
    };
    return colors[type] || '#6b7280';
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
        <h1 className="text-3xl font-bold">Incidents</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon size={20} /> Log Incident
        </button>
      </div>

      <div className="space-y-4">
        {incidents.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No incidents logged</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="badge" 
                      style={{ backgroundColor: getIncidentColor(incident.incident_type), color: 'white' }}
                    >
                      {incident.incident_type}
                    </span>
                    {incident.follow_up_required && (
                      <span className="badge badge-blue">Follow-up Required</span>
                    )}
                    {incident.owner_informed && (
                      <span className="badge badge-green">Owner Informed</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{incident.pet_name} - {incident.client_name}</h3>
                  <p className="text-sm text-gray-600">{formatDateTime(incident.incident_datetime)}</p>
                  {incident.location && (
                    <p className="text-sm text-gray-600">Location: {incident.location}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(incident)} 
                    className="btn btn-primary" 
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    View/Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(incident.id)} 
                    className="btn" 
                    style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <div>
                  <p className="text-sm font-medium text-gray-700">Summary:</p>
                  <p className="text-sm text-gray-600">{incident.summary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Actions Taken:</p>
                  <p className="text-sm text-gray-600">{incident.actions_taken}</p>
                </div>
                {incident.follow_up_notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Follow-up Notes:</p>
                    <p className="text-sm text-gray-600">{incident.follow_up_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', width: '100%' }}>
            <h2 className="text-2xl font-bold mb-6">{editingIncident ? 'Edit Incident' : 'Log New Incident'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Date/Time *</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.incident_datetime} 
                    onChange={e => setFormData({...formData, incident_datetime: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Incident Type *</label>
                  <select 
                    className="form-input" 
                    value={formData.incident_type} 
                    onChange={e => setFormData({...formData, incident_type: e.target.value})} 
                    required
                  >
                    <option value="Injury">Injury</option>
                    <option value="Illness">Illness</option>
                    <option value="Dog altercation">Dog altercation</option>
                    <option value="Human incident">Human incident</option>
                    <option value="Escape">Escape</option>
                    <option value="Property damage">Property damage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Related Pet *</label>
                  <select 
                    className="form-input" 
                    value={formData.related_pet_id} 
                    onChange={e => setFormData({...formData, related_pet_id: e.target.value})} 
                    required
                  >
                    <option value="">Select Pet</option>
                    {pets.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.client_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Related Booking (Optional)</label>
                  <select 
                    className="form-input" 
                    value={formData.related_booking_id} 
                    onChange={e => setFormData({...formData, related_booking_id: e.target.value})}
                  >
                    <option value="">None</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.client_name} - {new Date(b.datetime_start).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Location</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    placeholder="Where did this occur?"
                  />
                </div>
              </div>

              {/* Incident Details */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Incident Details</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Summary *</label>
                  <textarea 
                    className="form-textarea" 
                    rows="4" 
                    value={formData.summary} 
                    onChange={e => setFormData({...formData, summary: e.target.value})} 
                    placeholder="Describe what happened..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Actions Taken *</label>
                  <textarea 
                    className="form-textarea" 
                    rows="4" 
                    value={formData.actions_taken} 
                    onChange={e => setFormData({...formData, actions_taken: e.target.value})} 
                    placeholder="What actions were taken in response?"
                    required
                  />
                </div>
              </div>

              {/* Additional Information */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Additional Information</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.owner_informed} 
                    onChange={e => setFormData({...formData, owner_informed: e.target.checked})} 
                  />
                  <span>Owner Informed</span>
                </label>
                
                <div className="form-group">
                  <label className="form-label">Attachments (URLs)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.attachments} 
                    onChange={e => setFormData({...formData, attachments: e.target.value})} 
                    placeholder="Photo URLs (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">For actual file uploads, use external storage and paste URLs here</p>
                </div>

                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.follow_up_required} 
                    onChange={e => setFormData({...formData, follow_up_required: e.target.checked})} 
                  />
                  <span>Follow-up Required</span>
                </label>

                {formData.follow_up_required && (
                  <div className="form-group">
                    <label className="form-label">Follow-up Notes</label>
                    <textarea 
                      className="form-textarea" 
                      rows="3" 
                      value={formData.follow_up_notes} 
                      onChange={e => setFormData({...formData, follow_up_notes: e.target.value})} 
                      placeholder="What follow-up is needed?"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingIncident ? 'Update Incident' : 'Log Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
