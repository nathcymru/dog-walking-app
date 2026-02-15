import { useState, useEffect } from 'react';
import { PawIcon } from '../../components/Icons';
import api from '../../utils/api';

export default function ClientPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Pets</h1>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <PawIcon size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p className="text-gray-500">No pets registered yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                  <PawIcon size={32} style={{ color: '#0ea5e9' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{pet.name}</h3>
                  {pet.breed && <p className="text-gray-600 mb-3">{pet.breed}</p>}
                  
                  {pet.medical_notes && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Medical Notes:</p>
                      <p className="text-sm text-gray-600">{pet.medical_notes}</p>
                    </div>
                  )}
                  
                  {pet.behaviour_notes && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Behaviour:</p>
                      <p className="text-sm text-gray-600">{pet.behaviour_notes}</p>
                    </div>
                  )}
                  
                  {pet.vet_name && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Vet:</p>
                      <p className="text-sm text-gray-600">{pet.vet_name} {pet.vet_contact && `- ${pet.vet_contact}`}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
