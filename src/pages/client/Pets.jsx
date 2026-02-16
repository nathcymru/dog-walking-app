import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import api from '../../utils/api';

export default function ClientPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    try {
      const data = await api.client.getPets();
      setPets(data);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  }

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/client' },
    { label: 'My Pets', path: '/client/pets' }
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
        <h1 className="text-3xl font-bold">My Pets</h1>
      </div>

      {pets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-md">You haven't registered any pets yet.</p>
          <p className="text-sm text-gray-500">Contact us to add your furry friend!</p>
        </div>
      ) : (
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
                      <span className="pill pill-age">{pet.breed}</span>
                    </div>
                  </div>
                </div>
                
                {/* Body */}
                <div className="dog-card-body">
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

                  {/* Medical conditions */}
                  {pet.medical_conditions === 'Yes' && pet.condition_details && (
                    <div className="dog-card-section">
                      <div className="dog-card-section-title">
                        💊 Medical conditions
                      </div>
                      <p className="text-sm text-gray-600">{pet.condition_details}</p>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="dog-card-actions">
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    View full profile →
                  </button>
                  <button className="btn btn-icon btn-secondary" title="Photos">
                    📷
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
