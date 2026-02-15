import { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());

  useEffect(() => {
    loadClients();
  }, []);

  function getEmptyForm() {
    return {
      // Account
      email: '',
      password: '',
      // Identity & Contact
      full_name: '',
      mobile: '',
      preferred_contact_method: 'Email',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      // Address & Pickup
      address_line1: '',
      address_line2: '',
      town: '',
      county: '',
      postcode: '',
      pickup_notes: '',
      // Access & Keyholding
      access_required: false,
      entry_method: 'Key held',
      key_reference_id: '',
      lockbox_location: '',
      lockbox_code: '',
      alarm_present: false,
      alarm_instructions: '',
      alarm_code: '',
      parking_notes: '',
      equipment_storage_location: '',
      // Vet Details
      vet_practice_name: '',
      vet_phone: '',
      vet_address: '',
      // Consents
      terms_accepted: true,
      privacy_accepted: true,
      emergency_treatment_consent: 'Attempt contact first',
      emergency_spend_limit: '',
      transport_consent: true,
      photo_consent: true,
      group_walk_consent: true,
    };
  }

  async function loadClients() {
    try {
      const data = await api.admin.getClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingClient(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  }

  function openEditModal(client) {
    setEditingClient(client);
    setFormData({ ...client, password: '' });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.admin.updateClient(editingClient.id, formData);
      } else {
        await api.admin.createClient(formData);
      }
      setShowModal(false);
      loadClients();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete client "${name}"? This will also delete all their pets and bookings.`)) return;
    try {
      await api.admin.deleteClient(id);
      loadClients();
    } catch (error) {
      alert(error.message);
    }
  }

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
        <h1 className="text-3xl font-bold">Clients</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon size={20} /> Add Client
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Mobile</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Town</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Postcode</th>
              <th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{client.full_name}</td>
                <td style={{ padding: '1rem' }}>{client.email}</td>
                <td style={{ padding: '1rem' }}>{client.mobile}</td>
                <td style={{ padding: '1rem' }}>{client.town}</td>
                <td style={{ padding: '1rem' }}>{client.postcode}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => openEditModal(client)} className="btn btn-primary" style={{ marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(client.id, client.full_name)} className="btn" style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
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
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', width: '100%' }}>
            <h2 className="text-2xl font-bold mb-6">{editingClient ? 'Edit Client' : 'Create New Client'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Section */}
              {!editingClient && (
                <>
                  <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Account Credentials</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingClient} />
                    </div>
                  </div>
                </>
              )}

              {/* Identity & Contact */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Identity & Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile *</label>
                  <input type="tel" className="form-input" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
                </div>
                {editingClient && (
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Preferred Contact Method</label>
                  <select className="form-input" value={formData.preferred_contact_method} onChange={e => setFormData({...formData, preferred_contact_method: e.target.value})}>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name *</label>
                  <input type="text" className="form-input" value={formData.emergency_contact_name} onChange={e => setFormData({...formData, emergency_contact_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone *</label>
                  <input type="tel" className="form-input" value={formData.emergency_contact_phone} onChange={e => setFormData({...formData, emergency_contact_phone: e.target.value})} required />
                </div>
              </div>

              {/* Address & Pickup */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Address & Pickup</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input type="text" className="form-input" value={formData.address_line1} onChange={e => setFormData({...formData, address_line1: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2</label>
                  <input type="text" className="form-input" value={formData.address_line2} onChange={e => setFormData({...formData, address_line2: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Town/City *</label>
                  <input type="text" className="form-input" value={formData.town} onChange={e => setFormData({...formData, town: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">County *</label>
                  <input type="text" className="form-input" value={formData.county} onChange={e => setFormData({...formData, county: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Postcode *</label>
                  <input type="text" className="form-input" value={formData.postcode} onChange={e => setFormData({...formData, postcode: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Pickup Notes</label>
                  <textarea className="form-textarea" rows="2" value={formData.pickup_notes} onChange={e => setFormData({...formData, pickup_notes: e.target.value})} />
                </div>
              </div>

              {/* Access & Keyholding */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Access & Keyholding</h3>
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.access_required} onChange={e => setFormData({...formData, access_required: e.target.checked})} />
                  <span>Access Required</span>
                </label>
              </div>
              {formData.access_required && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Entry Method</label>
                    <select className="form-input" value={formData.entry_method} onChange={e => setFormData({...formData, entry_method: e.target.value})}>
                      <option value="Key held">Key held</option>
                      <option value="Lockbox">Lockbox</option>
                      <option value="Smart lock">Smart lock</option>
                      <option value="Concierge">Concierge</option>
                      <option value="Client hands over">Client hands over</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Key Reference ID</label>
                    <input type="text" className="form-input" value={formData.key_reference_id} onChange={e => setFormData({...formData, key_reference_id: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lockbox Location</label>
                    <input type="text" className="form-input" value={formData.lockbox_location} onChange={e => setFormData({...formData, lockbox_location: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lockbox Code</label>
                    <input type="password" className="form-input" value={formData.lockbox_code} onChange={e => setFormData({...formData, lockbox_code: e.target.value})} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.alarm_present} onChange={e => setFormData({...formData, alarm_present: e.target.checked})} />
                  <span>Alarm Present</span>
                </label>
              </div>
              {formData.alarm_present && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Alarm Instructions</label>
                    <textarea className="form-textarea" rows="2" value={formData.alarm_instructions} onChange={e => setFormData({...formData, alarm_instructions: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alarm Code</label>
                    <input type="password" className="form-input" value={formData.alarm_code} onChange={e => setFormData({...formData, alarm_code: e.target.value})} />
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Parking Notes</label>
                  <textarea className="form-textarea" rows="2" value={formData.parking_notes} onChange={e => setFormData({...formData, parking_notes: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Equipment Storage Location</label>
                  <input type="text" className="form-input" value={formData.equipment_storage_location} onChange={e => setFormData({...formData, equipment_storage_location: e.target.value})} />
                </div>
              </div>

              {/* Vet Details */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Vet Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Vet Practice Name *</label>
                  <input type="text" className="form-input" value={formData.vet_practice_name} onChange={e => setFormData({...formData, vet_practice_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Vet Phone *</label>
                  <input type="tel" className="form-input" value={formData.vet_phone} onChange={e => setFormData({...formData, vet_phone: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Vet Address</label>
                  <input type="text" className="form-input" value={formData.vet_address} onChange={e => setFormData({...formData, vet_address: e.target.value})} />
                </div>
              </div>

              {/* Consents */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Consents</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.terms_accepted} onChange={e => setFormData({...formData, terms_accepted: e.target.checked})} required />
                  <span>Terms Accepted *</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.privacy_accepted} onChange={e => setFormData({...formData, privacy_accepted: e.target.checked})} required />
                  <span>Privacy Policy Accepted *</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.group_walk_consent} onChange={e => setFormData({...formData, group_walk_consent: e.target.checked})} required />
                  <span>Group Walk Consent *</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.transport_consent} onChange={e => setFormData({...formData, transport_consent: e.target.checked})} />
                  <span>Transport Consent</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.photo_consent} onChange={e => setFormData({...formData, photo_consent: e.target.checked})} />
                  <span>Photo Consent</span>
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Emergency Treatment Consent</label>
                  <select className="form-input" value={formData.emergency_treatment_consent} onChange={e => setFormData({...formData, emergency_treatment_consent: e.target.value})}>
                    <option value="Attempt contact first">Attempt contact first</option>
                    <option value="Treat up to £X">Treat up to £X</option>
                    <option value="Treat immediately up to £X">Treat immediately up to £X</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Spend Limit (£)</label>
                  <input type="number" className="form-input" value={formData.emergency_spend_limit} onChange={e => setFormData({...formData, emergency_spend_limit: e.target.value})} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
