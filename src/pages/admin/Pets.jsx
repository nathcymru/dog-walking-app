import { useState, useEffect } from 'react';
import { PlusIcon } from '../../components/Icons';
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
      client_id: '',
      // Identity
      profile_photo_url: '',
      name: '',
      nickname: '',
      breed: '',
      sex: 'Male',
      neutered: false,
      date_of_birth: '',
      colour_markings: '',
      // Microchip
      microchipped: false,
      microchip_number: '',
      collar_tag_present: false,
      // Group Walk Compatibility
      group_walk_eligible: true,
      max_group_size: 4,
      around_other_dogs: 'Unknown',
      around_puppies: 'Unknown',
      around_small_dogs: 'Unknown',
      around_large_dogs: 'Unknown',
      play_style: 'Unknown',
      resource_guarding: 'Unknown',
      resource_guarding_details: '',
      muzzle_required_for_group: 'No',
      muzzle_trained: 'No',
      // Health
      allergies: 'Unknown',
      allergy_details: '',
      medical_conditions: 'Unknown',
      condition_details: '',
      medications: 'Unknown',
      medication_details: '',
      mobility_limits: 'None',
      heat_sensitivity: 'Unknown',
      vaccination_status: 'Unknown',
      parasite_control: 'Unknown',
      // Behaviour & Handling
      lead_type: 'Standard',
      harness_type: 'None',
      pulling_level: 5,
      recall_reliability: 5,
      escape_risk: 'Unknown',
      door_darter: 'Unknown',
      bite_history: 'Unknown',
      bite_history_details: '',
      reactivity_triggers: [],
      trigger_details: '',
      // Feeding
      treats_allowed: 'Yes',
      approved_treats: '',
      do_not_give_list: '',
      food_guarding: 'Unknown',
      // Walk Preferences
      preferred_walk_type: 'Any',
      preferred_duration: 30,
      environment_restrictions: [],
      other_restriction: '',
      routine_notes: '',
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

  function openCreateModal() {
    setEditingPet(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  }

  function openEditModal(pet) {
    setEditingPet(pet);
    // Parse stored arrays
    const triggers = pet.reactivity_triggers ? pet.reactivity_triggers.split(',') : [];
    const envRestrictions = pet.environment_restrictions ? pet.environment_restrictions.split(',') : [];
    setFormData({ 
      ...pet, 
      reactivity_triggers: triggers,
      environment_restrictions: envRestrictions
    });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Convert arrays to strings for storage
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

  async function handleDelete(id, name) {
    if (!confirm(`Delete pet "${name}"?`)) return;
    try {
      await api.admin.deletePet(id);
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
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pets</h1>
        <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
          <PlusIcon size={20} /> Add Pet
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Owner</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Breed</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Sex</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Group Eligible</th>
              <th style={{ textAlign: 'right', padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{pet.name}</td>
                <td style={{ padding: '1rem' }}>{pet.client_name}</td>
                <td style={{ padding: '1rem' }}>{pet.breed}</td>
                <td style={{ padding: '1rem' }}>{pet.sex}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${pet.group_walk_eligible ? 'badge-green' : 'badge-gray'}`}>
                    {pet.group_walk_eligible ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => openEditModal(pet)} className="btn btn-primary" style={{ marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pet.id, pet.name)} className="btn" style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
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
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', width: '100%' }}>
            <h2 className="text-2xl font-bold mb-6">{editingPet ? 'Edit Pet' : 'Create New Pet'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Owner Selection */}
              <div className="form-group">
                <label className="form-label">Owner / Client *</label>
                <select className="form-input" value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} required>
                  <option value="">Select Owner</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Identity */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Identity</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Profile Photo URL</label>
                  <input type="text" className="form-input" value={formData.profile_photo_url} onChange={e => setFormData({...formData, profile_photo_url: e.target.value})} placeholder="https://example.com/photo.jpg" />
                  <p className="text-xs text-gray-500 mt-1">Used as avatar throughout the system</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Nickname</label>
                  <input type="text" className="form-input" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Breed *</label>
                  <input type="text" className="form-input" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sex *</label>
                  <select className="form-input" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.neutered} onChange={e => setFormData({...formData, neutered: e.target.checked})} />
                    <span>Neutered</span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Colour / Markings</label>
                  <input type="text" className="form-input" value={formData.colour_markings} onChange={e => setFormData({...formData, colour_markings: e.target.value})} />
                </div>
              </div>

              {/* Microchip */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Microchip</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.microchipped} onChange={e => setFormData({...formData, microchipped: e.target.checked})} required />
                  <span>Microchipped *</span>
                </label>
                {formData.microchipped && (
                  <div className="form-group">
                    <label className="form-label">Microchip Number *</label>
                    <input type="text" className="form-input" value={formData.microchip_number} onChange={e => setFormData({...formData, microchip_number: e.target.value})} pattern="[0-9]{15}" placeholder="15 digits" required={formData.microchipped} />
                  </div>
                )}
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.collar_tag_present} onChange={e => setFormData({...formData, collar_tag_present: e.target.checked})} />
                  <span>Collar Tag Present</span>
                </label>
              </div>

              {/* Group Walk Compatibility */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Group Walk Compatibility</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.group_walk_eligible} onChange={e => setFormData({...formData, group_walk_eligible: e.target.checked})} required />
                  <span>Group Walk Eligible *</span>
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Max Group Size Allowed</label>
                  <select className="form-input" value={formData.max_group_size} onChange={e => setFormData({...formData, max_group_size: parseInt(e.target.value)})}>
                    <option value="1">1 - Solo only</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Around Other Dogs *</label>
                  <select className="form-input" value={formData.around_other_dogs} onChange={e => setFormData({...formData, around_other_dogs: e.target.value})} required>
                    <option value="Friendly">Friendly</option>
                    <option value="Selective">Selective</option>
                    <option value="Reactive">Reactive</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Around Puppies</label>
                  <select className="form-input" value={formData.around_puppies} onChange={e => setFormData({...formData, around_puppies: e.target.value})}>
                    <option value="OK">OK</option>
                    <option value="Not OK">Not OK</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Around Small Dogs</label>
                  <select className="form-input" value={formData.around_small_dogs} onChange={e => setFormData({...formData, around_small_dogs: e.target.value})}>
                    <option value="OK">OK</option>
                    <option value="Not OK">Not OK</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Around Large Dogs</label>
                  <select className="form-input" value={formData.around_large_dogs} onChange={e => setFormData({...formData, around_large_dogs: e.target.value})}>
                    <option value="OK">OK</option>
                    <option value="Not OK">Not OK</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Play Style</label>
                  <select className="form-input" value={formData.play_style} onChange={e => setFormData({...formData, play_style: e.target.value})}>
                    <option value="Gentle">Gentle</option>
                    <option value="Rough">Rough</option>
                    <option value="Doesn't play">Doesn't play</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Resource Guarding *</label>
                  <select className="form-input" value={formData.resource_guarding} onChange={e => setFormData({...formData, resource_guarding: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                {formData.resource_guarding === 'Yes' && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Resource Guarding Details</label>
                    <textarea className="form-textarea" rows="2" value={formData.resource_guarding_details} onChange={e => setFormData({...formData, resource_guarding_details: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Muzzle Required for Group</label>
                  <select className="form-input" value={formData.muzzle_required_for_group} onChange={e => setFormData({...formData, muzzle_required_for_group: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Sometimes">Sometimes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Muzzle Trained</label>
                  <select className="form-input" value={formData.muzzle_trained} onChange={e => setFormData({...formData, muzzle_trained: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="In progress">In progress</option>
                  </select>
                </div>
              </div>

              {/* Health */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Health</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Allergies *</label>
                  <select className="form-input" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                {formData.allergies === 'Yes' && (
                  <div className="form-group">
                    <label className="form-label">Allergy Details</label>
                    <textarea className="form-textarea" rows="2" value={formData.allergy_details} onChange={e => setFormData({...formData, allergy_details: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Medical Conditions *</label>
                  <select className="form-input" value={formData.medical_conditions} onChange={e => setFormData({...formData, medical_conditions: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                {formData.medical_conditions === 'Yes' && (
                  <div className="form-group">
                    <label className="form-label">Condition Details</label>
                    <textarea className="form-textarea" rows="2" value={formData.condition_details} onChange={e => setFormData({...formData, condition_details: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Medications *</label>
                  <select className="form-input" value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                {formData.medications === 'Yes' && (
                  <div className="form-group">
                    <label className="form-label">Medication Details</label>
                    <textarea className="form-textarea" rows="2" value={formData.medication_details} onChange={e => setFormData({...formData, medication_details: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Mobility Limits</label>
                  <select className="form-input" value={formData.mobility_limits} onChange={e => setFormData({...formData, mobility_limits: e.target.value})}>
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Significant">Significant</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Heat Sensitivity</label>
                  <select className="form-input" value={formData.heat_sensitivity} onChange={e => setFormData({...formData, heat_sensitivity: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Vaccination Status *</label>
                  <select className="form-input" value={formData.vaccination_status} onChange={e => setFormData({...formData, vaccination_status: e.target.value})} required>
                    <option value="Up to date">Up to date</option>
                    <option value="Not up to date">Not up to date</option>
                    <option value="Unknown">Unknown</option>
                    <option value="Exempt">Exempt</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Parasite Control Up to Date</label>
                  <select className="form-input" value={formData.parasite_control} onChange={e => setFormData({...formData, parasite_control: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {/* Behaviour & Handling */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Behaviour & Handling</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Lead Type *</label>
                  <select className="form-input" value={formData.lead_type} onChange={e => setFormData({...formData, lead_type: e.target.value})} required>
                    <option value="Standard">Standard</option>
                    <option value="Long line">Long line</option>
                    <option value="Slip">Slip</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Harness Type</label>
                  <select className="form-input" value={formData.harness_type} onChange={e => setFormData({...formData, harness_type: e.target.value})}>
                    <option value="None">None</option>
                    <option value="Harness">Harness</option>
                    <option value="Head collar">Head collar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pulling Level (0-10): {formData.pulling_level}</label>
                  <input type="range" min="0" max="10" className="form-input" value={formData.pulling_level} onChange={e => setFormData({...formData, pulling_level: parseInt(e.target.value)})} />
                  <p className="text-xs text-gray-500">0 = No pulling, 10 = Extreme pulling</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Recall Reliability (0-10): {formData.recall_reliability}</label>
                  <input type="range" min="0" max="10" className="form-input" value={formData.recall_reliability} onChange={e => setFormData({...formData, recall_reliability: parseInt(e.target.value)})} />
                  <p className="text-xs text-gray-500">0 = Never comes back, 10 = Perfect recall</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Escape Risk *</label>
                  <select className="form-input" value={formData.escape_risk} onChange={e => setFormData({...formData, escape_risk: e.target.value})} required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Door-Darter</label>
                  <select className="form-input" value={formData.door_darter} onChange={e => setFormData({...formData, door_darter: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Bite History *</label>
                  <select className="form-input" value={formData.bite_history} onChange={e => setFormData({...formData, bite_history: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                {formData.bite_history === 'Yes' && (
                  <div className="form-group">
                    <label className="form-label">Bite History Details</label>
                    <textarea className="form-textarea" rows="2" value={formData.bite_history_details} onChange={e => setFormData({...formData, bite_history_details: e.target.value})} />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Reactivity Triggers</label>
                <div className="space-y-2">
                  {['Dogs', 'People', 'Children', 'Bikes', 'Vehicles', 'Livestock', 'Loud noises', 'Other'].map(trigger => (
                    <label key={trigger} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.reactivity_triggers.includes(trigger)} 
                        onChange={() => handleCheckboxArray('reactivity_triggers', trigger)} 
                      />
                      <span>{trigger}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {formData.reactivity_triggers.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Trigger Details</label>
                  <textarea className="form-textarea" rows="2" value={formData.trigger_details} onChange={e => setFormData({...formData, trigger_details: e.target.value})} placeholder="Describe specific situations or severity..." />
                </div>
              )}

              {/* Feeding */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Feeding</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Treats Allowed *</label>
                  <select className="form-input" value={formData.treats_allowed} onChange={e => setFormData({...formData, treats_allowed: e.target.value})} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Owner-supplied only">Owner-supplied only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Food Guarding</label>
                  <select className="form-input" value={formData.food_guarding} onChange={e => setFormData({...formData, food_guarding: e.target.value})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Approved Treats</label>
                  <textarea className="form-textarea" rows="2" value={formData.approved_treats} onChange={e => setFormData({...formData, approved_treats: e.target.value})} placeholder="List approved treats..." />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Do Not Give List</label>
                  <textarea className="form-textarea" rows="2" value={formData.do_not_give_list} onChange={e => setFormData({...formData, do_not_give_list: e.target.value})} placeholder="Foods to avoid..." />
                </div>
              </div>

              {/* Walk Preferences */}
              <h3 className="text-lg font-semibold" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Walk Preferences</h3>
              <div className="alert" style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <p className="text-sm" style={{ color: '#1e40af' }}>
                  <strong>Off-lead by default:</strong> Our standard walking service is off-lead. If you require on-lead only, you must select Solo or Pair (Premium) when requesting bookings.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Preferred Walk Type *</label>
                  <select className="form-input" value={formData.preferred_walk_type} onChange={e => setFormData({...formData, preferred_walk_type: e.target.value})} required>
                    <option value="Solo">Solo</option>
                    <option value="Pair">Pair</option>
                    <option value="Group">Group</option>
                    <option value="Any">Any</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Solo and Pair are the only services that allow on-lead</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Duration (minutes) *</label>
                  <select className="form-input" value={formData.preferred_duration} onChange={e => setFormData({...formData, preferred_duration: parseInt(e.target.value)})} required>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Environment Restrictions</label>
                <div className="space-y-2">
                  {['No livestock fields', 'No woodland', 'No busy roads', 'No water', 'Other'].map(restriction => (
                    <label key={restriction} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.environment_restrictions.includes(restriction)} 
                        onChange={() => handleCheckboxArray('environment_restrictions', restriction)} 
                      />
                      <span>{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {formData.environment_restrictions.includes('Other') && (
                <div className="form-group">
                  <label className="form-label">Other Restriction</label>
                  <input type="text" className="form-input" value={formData.other_restriction} onChange={e => setFormData({...formData, other_restriction: e.target.value})} />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Routine Notes</label>
                <textarea className="form-textarea" rows="3" value={formData.routine_notes} onChange={e => setFormData({...formData, routine_notes: e.target.value})} placeholder="Any special routines or preferences..." />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Cancel</button>
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
