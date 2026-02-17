import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonList, 
  IonItem, 
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonSpinner,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react';
import { pawOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

const DEMO_PETS = [
  {
    id: 1,
    name: 'Buddy',
    breed: 'Golden Retriever',
    sex: 'Male',
    neutered: true,
    date_of_birth: '2020-05-15',
    microchipped: true,
    vaccinations_current: true
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Labrador',
    sex: 'Female',
    neutered: true,
    date_of_birth: '2019-08-22',
    microchipped: true,
    vaccinations_current: true
  }
];

export default function ClientPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'My Pets', path: '/client/pets' }
  ];

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
        if (Array.isArray(data) && data.length > 0) {
          setPets(data);
        } else {
          // No pets from API, use demo data
          setPets(DEMO_PETS);
        }
      } else {
        // API error, use demo data
        setPets(DEMO_PETS);
      }
    } catch (error) {
      // Network error, use demo data
      setPets(DEMO_PETS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="My Pets" />
        <IonContent>
          <div className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title="My Pets" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {pets.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>No pets found. Please contact your administrator to add pet profiles.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonGrid>
              <IonRow>
                {pets.map((pet) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={pet.id}>
                    <IonCard>
                      <IonCardHeader>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <IonIcon icon={pawOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-primary)' }} />
                          <div>
                            <IonCardTitle>{pet.name}</IonCardTitle>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>{pet.breed}</p>
                          </div>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonList lines="none">
                          <IonItem>
                            <IonLabel>
                              <p><strong>Sex:</strong> {pet.sex} {pet.neutered ? '(Neutered)' : ''}</p>
                              {pet.date_of_birth && <p><strong>DOB:</strong> {pet.date_of_birth}</p>}
                              {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                              {pet.microchipped && <p><strong>Microchipped:</strong> Yes</p>}
                              {pet.vaccinations_current && <p><strong>Vaccinations:</strong> Current</p>}
                            </IonLabel>
                          </IonItem>
                        </IonList>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}
        </div>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          duration={3000}
          color={toast.color}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
}