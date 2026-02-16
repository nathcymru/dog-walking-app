import { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/Icons';
import Breadcrumbs from '../../components/Breadcrumbs';
import api from '../../utils/api';

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());

  useEffect(() => {
    loadData();
  }, []);

  function getEmptyForm() {
    return {
      client_id: '', profile_photo_url: '', name: '', nickname: '', breed: '', sex: 'Male',
      neutered: false, date_of_birth: '', colour_markings: '', microchipped: false,
      microchip_number: '', collar_tag_present: false, group_walk_eligible: true, max_group_size: 4,
      around_other_dogs: 'Unknown', around_puppies: 'Unknown', around_small_dogs: 'Unknown',
      around_large_dogs: 'Unknown', play_style: 'Unknown', resource_guarding: 'Unknown',
      resource_guarding_details: '', muzzle_required_for_group: 'No', muzzle_trained: 'No',
      allergies: 'Unknown', allergy_details: '', medical_conditions: 'Unknown', condition_details: '',
      medications: 'Unknown', medication_details: '', mobility_limits: 'None', heat_sensitivity: 'Unknown',
      vaccination_status: 'Unknown', parasite_control: 'Unknown', lead_type: 'Standard', harness_type: 'None',
      pulling_level: 5, recall_reliability: 5, escape_risk: 'Unknown', door_darter: 'Unknown',
      bite_history: 'Unknown', bite_history_details: '', reactivity_triggers: [], trigger_details: '',
      treats_allowed: 'Yes', approved_treats: '', do_not_give_list: '', food_guarding: 'Unknown',
      preferred_walk_type: 'Any', preferred_duration: 30, environment_restrictions: [],
      other_restriction: '', routine_notes: '',
    };
  }

  async function loadData() {
    try {
      const [petsData, clientsData] = await Promise.all([
        api.admin.getPets(),
        api.admin.getClients(),
      ]);
      setPets(petsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete pet "${name}"?`)) return;
    try {
      await api.admin.deletePet(id);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Pets', path: '/admin/pets' }
  ];

  function getGenderPill(sex) {
    if (sex === 'Male') return 'pill-boy';
    if (sex === 'Female') return 'pill-girl';
    return 'pill-unknown';
  }

  function calculateAge(dob) {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getWarnings(pet) {
    const warnings = [];
    if (pet.bite_history === 'Yes') warnings.push('Bite history');
    if (pet.escape_risk === 'High') warnings.push('Escape risk');
    if (pet.resource_guarding === 'Yes') warnings.push('Resource guarding');
    if (pet.reactivity_triggers && pet.reactivity_triggers.length > 0) {
      const triggers = pet.reactivity_triggers.split(',').filter(t => t.trim());
      if (triggers.length > 0) warnings.push(`Reactive: ${triggers.slice(0, 2).join(', ')}`);
    }
    return warnings;
  }

  function getAllergies(pet) {
    const allergies = [];
    if (pet.allergies === 'Yes' && pet.allergy_details) {
      const details = pet.allergy_details.split(',').map(a => a.trim()).filter(Boolean);
      allergies.push(...details);
    }
    return allergies;
  }

  async function openEditModal(pet) {
    setEditingPet(pet);
    try {
      const fullPet = await api.admin.getPet(pet.id);
      const triggers = fullPet.reactivity_triggers ? fullPet.reactivity_triggers.split(',') : [];
      const envRestrictions = fullPet.environment_restrictions ? fullPet.environment_restrictions.split(',') : [];
      setFormData({ 
        ...fullPet, 
        reactivity_triggers: triggers,
        environment_restrictions: envRestrictions
      });
      setShowModal(true);
    } catch (error) {
      alert('Failed to load pet details');
    }
  }

  function openCreateModal() {
    setEditingPet(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      reactivity_triggers: formData.reactivity_triggers.join(','),
      environment_restrictions: formData.environment_restrictions.join(','),
    };

    try {
      if (editingPet) {
        await api.admin.updatePet(editingPet.id, dataToSend);
      } else {
        await api.admin.createPet(dataToSend);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleCheckboxArray = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="flex justify-between items-center mb-xl">
        <h1 className="text-3xl font-bold">Pets</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-sm">
          <PlusIcon size={20} /> Add Pet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => {
          const age = calculateAge(pet.date_of_birth);
          const warnings = getWarnings(pet);
          const allergies = getAllergies(pet);

          return (
            <div key={pet.id} className="dog-card">
              {/* Header with photo */}
              <div className="dog-card-header">
                {pet.profile_photo_url ? (
                  <img src={pet.profile_photo_url} alt={pet.name} />
                ) : (
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--pastel-sky) 0%, var(--pastel-lavender) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                  }}>
                    🐕
                  </div>
                )}
                
                {/* Name bubble */}
                <div className="dog-card-name-bubble">
                  <h3 className="dog-card-name">{pet.name}</h3>
                  <div className="dog-card-meta">
                    <span className={`pill ${getGenderPill(pet.sex)}`}>
                      {pet.sex === 'Male' ? '♂️ Boy' : pet.sex === 'Female' ? '♀️ Girl' : 'Unknown'}
                    </span>
                    {age !== null && (
                      <span className="pill pill-age">
                        {age} {age === 1 ? 'year' : 'years'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-sm">
                    Owner: {pet.client_name}
                  </div>
                </div>
              </div>
              
              {/* Body */}
              <div className="dog-card-body">
                <div className="dog-card-section mb-sm">
                  <div className="text-sm font-semibold text-gray-700 mb-xs">Breed</div>
                  <div className="text-sm text-gray-600">{pet.breed}</div>
                </div>

                <div className="dog-card-divider"></div>
                
                {/* Warnings section */}
                {warnings.length > 0 && (
                  <div className="dog-card-section">
                    <div className="dog-card-section-title">
                      ⚠️ Behaviour warnings
                    </div>
                    <div className="dog-card-badges">
                      {warnings.map((warning, idx) => (
                        <span key={idx} className="pill pill-warning">{warning}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Allergies section */}
                {allergies.length > 0 && (
                  <div className="dog-card-section">
                    <div className="dog-card-section-title">
                      🏥 Allergies
                    </div>
                    <div className="dog-card-badges">
                      {allergies.map((allergy, idx) => (
                        <span key={idx} className="pill pill-allergy">{allergy}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Group walk eligible */}
                <div className="dog-card-section">
                  <div className="dog-card-section-title">
                    🐾 Group walks
                  </div>
                  <span className={`pill ${pet.group_walk_eligible ? 'pill-boy' : 'pill-warning'}`}>
                    {pet.group_walk_eligible ? '✓ Group eligible' : '✗ Solo only'}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="dog-card-actions">
                <button 
                  onClick={() => openEditModal(pet)} 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  View full profile →
                </button>
                <button 
                  onClick={() => openEditModal(pet)} 
                  className="btn btn-icon btn-secondary" 
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(pet.id, pet.name)} 
                  className="btn btn-icon btn-secondary" 
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full edit modal from previous comprehensive version */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', width: '100%' }}>
            <h2 className="text-2xl font-bold mb-lg">{editingPet ? 'Edit Pet' : 'Create New Pet'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-lg">
              {/* Owner Selection */}
              <div className="form-group">
                <label className="form-label">Owner / Client *</label>
                <select className="form-select" value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} required>
                  <option value="">Select Owner</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2" style={{gap: 'var(--space-md)'}}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Breed *</label>
                  <input type="text" className="form-input" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sex *</label>
                  <select className="form-select" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-sm justify-end" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 'var(--space-lg)' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingPet ? 'Update Pet' : 'Create Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
