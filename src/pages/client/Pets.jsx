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
  IonIcon,
  IonSpinner,
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/react';
import { pawOutline, addOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function ClientPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

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
      
      if (response.status === 403 || response.status === 401) {
        setToast({ show: true, message: 'Authentication required. Please log in.', color: 'danger' });
        setPets([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.error) {
        setToast({ show: true, message: data.error, color: 'danger' });
        setPets([]);
      } else if (Array.isArray(data)) {
        setPets(data);
      } else {
        setToast({ show: true, message: 'Invalid response format', color: 'danger' });
        setPets([]);
      }
    } catch (error) {
      setToast({ show: true, message: 'Failed to fetch pets', color: 'danger' });
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>My Pets</IonTitle>
          </IonToolbar>
        </IonHeader>
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
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Pets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={[
          { label: 'Home', path: '/client/dashboard' },
          { label: 'Client', path: '/client/dashboard' },
          { label: 'My Pets', path: '/client/pets' }
        ]} />
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