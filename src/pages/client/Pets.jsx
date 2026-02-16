import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonTitle,
  IonToolbar,
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
  IonAvatar,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { addOutline, createOutline, pawOutline, medicalOutline, restaurantOutline, homeOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
  const [petsData, setPetsData] = useState([
    {
      id: 1,
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
      access_instructions: 'Key under mat, alarm code 1234.',
      feeding_notes: '2 cups of dry food twice daily (morning and evening).',
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
    },
    {
      id: 2,
      name: 'Bella',
      breed: 'Labrador',
      date_of_birth: '2019-06-20',
      age: '7 years',
      photo_url: null,
      vet_name: 'Dr. John Smith',
      vet_contact: '020 8765 4321',
      medical_notes: 'Sensitive stomach - avoid rich foods.',
      medications: 'None',
      behaviour_notes: 'Very friendly, loves everyone!',
      access_instructions: 'Ring doorbell, owner will answer.',
      feeding_notes: '1.5 cups of sensitive stomach formula twice daily.',
      color: 'Black',
      weight: '28kg',
      microchip_number: '987654321098765',
      insurance_provider: 'AnimalFriends',
      insurance_policy_number: 'AF789012',
      emergency_contact_name: 'John Smith',
      emergency_contact_phone: '020 9876 5432',
      special_needs: 'Requires sensitive diet',
      exercise_requirements: 'Moderate - 1 hour daily',
      favorite_treats: 'Dental chews',
      dislikes: 'Being alone',
      walking_equipment: 'Collar and standard leash',
      recall_reliability: 'Excellent',
      can_be_off_leash: true,
      socialization_notes: 'Excellent with all dogs and people',
      training_level: 'Advanced obedience',
    }
  ]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      // const response = await fetch('/api/client/pets');
      // const data = await response.json();
      // setPetsData(data.pets);
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

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'My Pets', path: '/client/pets' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Pets</IonTitle>
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
              <IonButton expand="block" color="primary" onClick={handleAddPet}>
                <IonIcon icon={addOutline} slot="start" />
                Add New Pet
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            {petsData.map(pet => (
              <IonCol size="12" sizeMd="6" key={pet.id}>
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
                          <h3>Age & Date of Birth</h3>
                          <p>{pet.age} • Born {new Date(pet.date_of_birth).toLocaleDateString()}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Color & Weight</h3>
                          <p>{pet.color} • {pet.weight}</p>
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
                          <p>{pet.vet_name}</p>
                          <p>{pet.vet_contact}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Medical Notes</h3>
                          <p>{pet.medical_notes}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Medications</h3>
                          <p>{pet.medications}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Insurance */}
                      <IonItem>
                        <IonLabel>
                          <h3>Insurance</h3>
                          <p>{pet.insurance_provider}</p>
                          <p>Policy: {pet.insurance_policy_number}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Behaviour */}
                      <IonItem>
                        <IonLabel>
                          <h3>Behaviour Notes</h3>
                          <p>{pet.behaviour_notes}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Training Level</h3>
                          <p>{pet.training_level}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Off-Leash Capability</h3>
                          <IonBadge color={pet.can_be_off_leash ? 'success' : 'warning'}>
                            {pet.can_be_off_leash ? 'Can be off-leash' : 'Keep on leash'}
                          </IonBadge>
                        </IonLabel>
                      </IonItem>

                      {/* Feeding */}
                      <IonItem>
                        <IonIcon icon={restaurantOutline} slot="start" color="success" />
                        <IonLabel>
                          <h3>Feeding</h3>
                          <p>{pet.feeding_notes}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Favorite Treats</h3>
                          <p>{pet.favorite_treats}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Dislikes</h3>
                          <p>{pet.dislikes}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Access & Walking */}
                      <IonItem>
                        <IonIcon icon={homeOutline} slot="start" color="tertiary" />
                        <IonLabel>
                          <h3>Access Instructions</h3>
                          <p>{pet.access_instructions}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Exercise Requirements</h3>
                          <p>{pet.exercise_requirements}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <h3>Walking Equipment</h3>
                          <p>{pet.walking_equipment}</p>
                        </IonLabel>
                      </IonItem>

                      {/* Emergency Contact */}
                      <IonItem>
                        <IonLabel>
                          <h3>Emergency Contact</h3>
                          <p>{pet.emergency_contact_name}</p>
                          <p>{pet.emergency_contact_phone}</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>

                    <IonButton
                      expand="block"
                      fill="outline"
                      color="primary"
                      onClick={() => handleEditPet(pet.id)}
                      style={{ marginTop: '1rem' }}
                    >
                      <IonIcon icon={createOutline} slot="start" />
                      Edit Pet Details
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;