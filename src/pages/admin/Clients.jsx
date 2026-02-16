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
  IonSearchbar,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonSpinner,
  IonFab,
  IonFabButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { add, logOut, create, trash, person, mail, call } from 'ionicons/icons';
import { useAuth } from '../../utils/auth';
import { useHistory } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';

const Clients = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error('Failed to fetch clients', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const handleSearch = (e) => {
    setSearchText(e.detail.value || '');
  };

  const filteredClients = clients.filter(client => 
    client.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    client.mobile?.includes(searchText)
  );

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Admin', path: '/admin' },
    { label: 'Clients' }
  ];

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Clients</IonTitle>
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
          <IonTitle>Manage Clients</IonTitle>
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
        <IonSearchbar 
          value={searchText} 
          onIonInput={handleSearch}
          placeholder='Search clients by name, email, or phone'
        />

        <IonGrid>
          <IonRow>
            {filteredClients.length === 0 ? (
              <IonCol size="12">
                <IonCard>
                  <IonCardContent>
                    <div className="ion-text-center">
                      <IonIcon icon={person} style={{ fontSize: '4rem', color: 'var(--ion-color-medium)' }} />
                      <h2>No clients found</h2>
                      {searchText ? (
                        <p>No clients match your search.</p>
                      ) : (
                        <>
                          <p>Add your first client to get started!</p>
                          <IonButton color="primary">
                            <IonIcon icon={add} slot="start" />
                            Add Client
                          </IonButton>
                        </>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ) : (
              filteredClients.map((client) => (
                <IonCol key={client.id} size="12" sizeMd="6" sizeLg="4">
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{client.full_name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {/* Contact Information */}
                      {client.email && (
                        <p>
                          <IonIcon icon={mail} style={{ marginRight: '0.5rem' }} />
                          {client.email}
                        </p>
                      )}
                      {client.mobile && (
                        <p>
                          <IonIcon icon={call} style={{ marginRight: '0.5rem' }} />
                          {client.mobile}
                        </p>
                      )}
                      
                      {/* Address */}
                      {client.address_line1 && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Address:</strong>
                          <p style={{ margin: '0.25rem 0' }}>
                            {client.address_line1}
                            {client.address_line2 && <><br/>{client.address_line2}</>}
                            {client.city && <><br/>{client.city}</>}
                            {client.postcode && <><br/>{client.postcode}</>}
                          </p>
                        </div>
                      )}

                      {/* Emergency Contact */}
                      {client.emergency_contact_name && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Emergency Contact:</strong>
                          <p style={{ margin: '0.25rem 0' }}>
                            {client.emergency_contact_name}
                            {client.emergency_contact_phone && <><br/>{client.emergency_contact_phone}</>}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <IonButton size="small" fill="outline">
                          <IonIcon icon={create} slot="start" />
                          Edit
                        </IonButton>
                        <IonButton size="small" fill="outline" color="danger">
                          <IonIcon icon={trash} slot="start" />
                          Delete
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
