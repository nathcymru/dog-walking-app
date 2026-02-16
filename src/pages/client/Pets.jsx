import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { logOut, paw } from 'ionicons/icons';
import { useAuth } from '../../utils/auth';
import { useHistory } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/client/pets', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPets(Array.isArray(data) ? data : []);
      } else {
        setPets([]);
      }
    } catch (error) {
      console.error('Failed to fetch pets', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Client', path: '/client' },
    { label: 'My Pets' }
  ];

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>My Pets</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-text-center ion-padding">
            <IonSpinner color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Pets</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOut} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {pets.length === 0 ? (
              <IonCol size="12">
                <IonCard>
                  <IonCardContent>
                    <div className="ion-text-center">
                      <IonIcon icon={paw} style={{ fontSize: '4rem', color: 'var(--ion-color-medium)' }} />
                      <h2>No pets found</h2>
                      <p>Contact your dog walker to add your pets.</p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ) : (
              pets.map((pet) => (
                <IonCol key={pet.id} size="12" sizeMd="6" sizeLg="4">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        {pet.name}
                        {pet.sex && (
                          <IonBadge 
                            color={pet.sex === 'Male' ? 'primary' : pet.sex === 'Female' ? 'secondary' : 'medium'}
                            style={{ marginLeft: '0.5rem' }}
                          >
                            {pet.sex}
                          </IonBadge>
                        )}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {/* Basic Info */}
                      {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                      {pet.color && <p><strong>Color:</strong> {pet.color}</p>}
                      {pet.date_of_birth && (
                        <p><strong>Birth Date:</strong> {new Date(pet.date_of_birth).toLocaleDateString()}</p>
                      )}
                      {pet.weight && <p><strong>Weight:</strong> {pet.weight} kg</p>}
                      {pet.size_category && <p><strong>Size:</strong> {pet.size_category}</p>}
                      
                      {/* Health Info */}
                      {pet.neutered !== undefined && (
                        <p><strong>Neutered:</strong> {pet.neutered ? 'Yes' : 'No'}</p>
                      )}
                      {pet.microchip_number && (
                        <p><strong>Microchip:</strong> {pet.microchip_number}</p>
                      )}
                      {pet.vaccination_status && (
                        <p>
                          <strong>Vaccinations:</strong>{' '}
                          <IonBadge color={pet.vaccination_status === 'Up-to-date' ? 'success' : 'warning'}>
                            {pet.vaccination_status}
                          </IonBadge>
                        </p>
                      )}
                      
                      {/* Behavior */}
                      {pet.ok_around_dogs !== undefined && (
                        <p><strong>OK with other dogs:</strong> {pet.ok_around_dogs ? 'Yes' : 'No'}</p>
                      )}
                      {pet.recall_ability && (
                        <p><strong>Recall ability:</strong> {pet.recall_ability}</p>
                      )}
                      {pet.lead_type && (
                        <p><strong>Lead type:</strong> {pet.lead_type}</p>
                      )}
                      
                      {/* Medical Conditions */}
                      {pet.medical_conditions && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Medical Conditions:</strong>
                          <p style={{ color: 'var(--ion-color-danger)' }}>{pet.medical_conditions}</p>
                        </div>
                      )}
                      
                      {/* Allergies */}
                      {pet.allergies && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Allergies:</strong>
                          <p style={{ color: 'var(--ion-color-warning)' }}>{pet.allergies}</p>
                        </div>
                      )}
                      
                      {/* Medications */}
                      {pet.medications && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Medications:</strong>
                          <p>{pet.medications}</p>
                        </div>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;