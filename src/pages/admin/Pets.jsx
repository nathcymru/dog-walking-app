import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonButtons,
  IonMenuButton,
  IonAvatar,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, pawOutline, medicalOutline, restaurantOutline, homeOutline, alertCircleOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
  const [pets, setPets] = useState([
    {
      id: 1,
      client_id: 2,
      client_name: 'John Smith',
      name: 'Max',
      breed: 'Golden Retriever',
      date_of_birth: '2020-03-15',
      age: '6 years',
      photo_url: null,
      vet_name: 'Dr. Sarah Johnson',
      vet_contact: '020 1234 5678',
      medical_notes: 'No known allergies. Up to date on vaccinations.',
      medications: 'None',
      behaviour_notes: 'Friendly with other dogs. May bark at strangers initially. Loves treats!',
      access_instructions: 'Key under mat, alarm code 1234. Ring doorbell twice.',
      feeding_notes: '2 cups of dry food twice daily (morning and evening). Water bowl should always be full.',
      color: 'Golden',
      weight: '30kg',
      microchip_number: '123456789012345',
      insurance_provider: 'PetPlan',
      insurance_policy_number: 'PP123456',
      emergency_contact_name: 'Jane Smith',
      emergency_contact_phone: '020 9876 5432',
      special_needs: 'None',
      exercise_requirements: 'High - needs 1-2 hours daily',
      favorite_treats: 'Chicken treats, carrots',
      dislikes: 'Loud noises, thunderstorms',
      walking_equipment: 'Harness and 6ft leash',
      recall_reliability: 'Good',
      can_be_off_leash: true,
      socialization_notes: 'Well socialized with dogs and people',
      training_level: 'Basic obedience trained',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-02-01T10:00:00Z'
    }
  ]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      // const response = await fetch('/api/admin/pets');
      // const data = await response.json();
      // setPets(data.pets);
      // For now using demo data
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    }
  };

  const handleAddPet = () => {
    console.log('Add new pet');
  };

  const handleEditPet = (petId) => {
    console.log('Edit pet:', petId);
  };

  const handleDeletePet = (petId) => {
    console.log('Delete pet:', petId);
    setPets(pets.filter(pet => pet.id !== petId));
  };

  const handleSearch = (e) => {
    setSearchText(e.detail.value);
  };

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    pet.breed?.toLowerCase().includes(searchText.toLowerCase()) ||
    pet.client_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Pets', path: '/admin/pets' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Pets</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAddPet}>
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonSearchbar
                value={searchText}
                onIonInput={handleSearch}
                placeholder="Search pets by name, breed, or owner"
                animated={true}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonButton expand="block" color="primary" onClick={handleAddPet}>
                <IonIcon icon={addOutline} slot="start" />
                Add New Pet
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            {filteredPets.map(pet => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={pet.id}>
                <IonCard>
                  <IonCardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <IonAvatar>
                        {pet.photo_url ? (
                          <img src={pet.photo_url} alt={pet.name} />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: 'var(--ion-color-primary)',
                            color: 'white'
                          }}>
                            <IonIcon icon={pawOutline} />
                          </div>
                        )}
                      </IonAvatar>
                      <div>
                        <IonCardTitle>{pet.name}</IonCardTitle>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>
                          {pet.breed}
                        </p>
                      </div>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      {/* Basic Information */}
                      <IonItem>
                        <IonLabel>
                          <h3>Owner</h3>
                          <p>{pet.client_name}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Age</h3>
                          <p>{pet.date_of_birth ? new Date().getFullYear() - new Date(pet.date_of_birth).getFullYear() + ' years' : 'Unknown'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Date of Birth</h3>
                          <p>{pet.date_of_birth ? new Date(pet.date_of_birth).toLocaleDateString() : 'Unknown'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Color & Weight</h3>
                          <p>{pet.color || 'N/A'} • {pet.weight || 'N/A'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Microchip</h3>
                          <p>{pet.microchip_number || 'Not registered'}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Veterinary Information */}
                      <IonItem>
                        <IonIcon icon={medicalOutline} slot="start" color="danger" />
                        <IonLabel>
                          <h3>Veterinarian</h3>
                          <p>{pet.vet_name || 'N/A'}</p>
                          <p>{pet.vet_contact || ''}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Medical Notes</h3>
                          <p>{pet.medical_notes || 'None'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Medications</h3>
                          <p>{pet.medications || 'None'}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Insurance */}
                      <IonItem>
                        <IonLabel>
                          <h3>Insurance</h3>
                          <p>{pet.insurance_provider || 'Not insured'}</p>
                          {pet.insurance_policy_number && <p>Policy: {pet.insurance_policy_number}</p>}
                        </IonLabel>
                      </IonItem>

                      {/* Behaviour & Training */}
                      <IonItem>
                        <IonIcon icon={alertCircleOutline} slot="start" color="warning" />
                        <IonLabel>
                          <h3>Behaviour Notes</h3>
                          <p>{pet.behaviour_notes || 'None'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Training Level</h3>
                          <p>{pet.training_level || 'Unknown'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Recall Reliability</h3>
                          <p>{pet.recall_reliability || 'Unknown'}</p>
                          <IonBadge color={pet.can_be_off_leash ? 'success' : 'warning'}>
                            {pet.can_be_off_leash ? 'Can be off-leash' : 'Keep on leash'}
                          </IonBadge>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Socialization</h3>
                          <p>{pet.socialization_notes || 'None'}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Feeding */}
                      <IonItem>
                        <IonIcon icon={restaurantOutline} slot="start" color="success" />
                        <IonLabel>
                          <h3>Feeding Notes</h3>
                          <p>{pet.feeding_notes || 'Standard diet'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Favorite Treats</h3>
                          <p>{pet.favorite_treats || 'N/A'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Dislikes</h3>
                          <p>{pet.dislikes || 'None noted'}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Access & Walking */}
                      <IonItem>
                        <IonIcon icon={homeOutline} slot="start" color="tertiary" />
                        <IonLabel>
                          <h3>Access Instructions</h3>
                          <p>{pet.access_instructions || 'None provided'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Exercise Requirements</h3>
                          <p>{pet.exercise_requirements || 'Moderate'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Walking Equipment</h3>
                          <p>{pet.walking_equipment || 'Standard leash'}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Special Needs</h3>
                          <p>{pet.special_needs || 'None'}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Emergency Contact */}
                      <IonItem>
                        <IonLabel>
                          <h3>Emergency Contact</h3>
                          <p>{pet.emergency_contact_name || 'N/A'}</p>
                          <p>{pet.emergency_contact_phone || ''}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Timestamps */}
                      <IonItem>
                        <IonLabel>
                          <p>Added: {new Date(pet.created_at).toLocaleDateString()}</p>
                          <p>Updated: {new Date(pet.updated_at).toLocaleDateString()}</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="primary"
                        onClick={() => handleEditPet(pet.id)}
                      >
                        <IonIcon icon={createOutline} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton
                        expand="block"
                        fill="outline"
                        color="danger"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        <IonIcon icon={trashOutline} slot="start" />
                        Delete
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>

          {filteredPets.length === 0 && (
            <IonRow>
              <IonCol size="12" className="ion-text-center">
                <p style={{ padding: '2rem', color: 'var(--ion-color-medium)' }}>
                  No pets found. {searchText && 'Try a different search term.'}
                </p>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;