import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
  IonToast,
  IonButtons,
  IonIcon,
  IonAlert,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonBadge,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { add, create, trash, close, pawOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useAuth } from '../../utils/auth';
import { useHistory } from 'react-router-dom';

export default function AdminPets() {
  const { user } = useAuth();
  const history = useHistory();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, petId: null });
  const [searchText, setSearchText] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Pets', path: '/admin/pets' }
  ];

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter(pet => 
        pet.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchText.toLowerCase()) ||
        pet.client_name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPets(filtered);
    }
  }, [pets, searchText]);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/admin/pets', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 403 || response.status === 401) {
        showToast('Authentication required. Please log in.', 'danger');
        setPets([]);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.error) {
        showToast(data.error, 'danger');
        setPets([]);
      } else if (Array.isArray(data)) {
        setPets(data);
      } else {
        showToast('Invalid response format', 'danger');
        setPets([]);
      }
    } catch (error) {
      showToast('Failed to fetch pets', 'danger');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, color = 'success') => {
    setToast({ show: true, message, color });
  };

  const openCreateForm = () => {
    history.push('/admin/pets/new');
  };

  const openEditForm = (pet) => {
    history.push(`/admin/pets/${pet.id}/edit`);
  };

  const handleDelete = async (petId) => {
    try {
      const response = await fetch(`/api/admin/pets/${petId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        showToast('Pet deleted successfully');
        fetchPets();
      } else {
        showToast('Failed to delete pet', 'danger');
      }
    } catch (error) {
      showToast('Error deleting pet', 'danger');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="Pets" />
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
      <AppHeader title="Pets" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonButton color="primary" onClick={openCreateForm}>
            <IonIcon icon={add} slot="start" />
            New Pet
          </IonButton>
          
          <IonSearchbar
            value={searchText}
            onIonChange={(e) => setSearchText(e.detail.value)}
            placeholder="Search pets by name, breed, or client"
          />
          
          {filteredPets.length === 0 ? (
            <IonCard>
              <IonCardContent>
                <p>{searchText ? 'No pets found matching your search.' : 'No pets found. Create your first pet profile!'}</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonGrid>
              <IonRow>
                {filteredPets.map((pet) => (
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
                              <p><strong>Client:</strong> {pet.client_name}</p>
                              <p><strong>Sex:</strong> {pet.sex} {pet.neutered ? '(Neutered)' : ''}</p>
                              {pet.date_of_birth && <p><strong>DOB:</strong> {pet.date_of_birth}</p>}
                              {pet.microchipped && <p><strong>Microchip:</strong> {pet.microchip_number || 'Yes'}</p>}
                            </IonLabel>
                          </IonItem>
                        </IonList>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <IonButton size="small" fill="outline" expand="block" onClick={() => openEditForm(pet)}>
                            <IonIcon icon={create} slot="start" />
                            Edit
                          </IonButton>
                          <IonButton size="small" fill="outline" color="danger" expand="block" onClick={() => setDeleteAlert({ show: true, petId: pet.id })}>
                            <IonIcon icon={trash} slot="start" />
                            Delete
                          </IonButton>
                        </div>
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

        <IonAlert
          isOpen={deleteAlert.show}
          header="Confirm Delete"
          message="Are you sure you want to delete this pet? This will also remove all associated data."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteAlert({ show: false, petId: null }),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: () => {
                handleDelete(deleteAlert.petId);
                setDeleteAlert({ show: false, petId: null });
              },
            },
          ]}
          onDidDismiss={() => setDeleteAlert({ show: false, petId: null })}
        />
      </IonContent>
    </IonPage>
  );
}