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
  IonSearchbar,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonIcon,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, personOutline, mailOutline, callOutline, homeOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      user_id: 2,
      email: 'client@example.com',
      role: 'client',
      full_name: 'John Smith',
      phone: '020 9876 5432',
      address: '123 Dog Street, London, N1 1AA',
      created_at: '2026-01-15T10:00:00Z',
      updated_at: '2026-01-15T10:00:00Z',
      total_pets: 1,
      total_bookings: 1,
      status: 'active'
    }
  ]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Fetch clients from API
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // const response = await fetch('/api/admin/clients');
      // const data = await response.json();
      // setClients(data.clients);
      // For now using demo data
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const handleAddClient = () => {
    // TODO: Open modal or navigate to add client form
    console.log('Add new client');
  };

  const handleEditClient = (clientId) => {
    // TODO: Open modal or navigate to edit client form
    console.log('Edit client:', clientId);
  };

  const handleDeleteClient = (clientId) => {
    // TODO: Confirm and delete client
    console.log('Delete client:', clientId);
    setClients(clients.filter(client => client.id !== clientId));
  };

  const handleSearch = (e) => {
    setSearchText(e.detail.value);
  };

  const filteredClients = clients.filter(client => 
    client.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchText.toLowerCase())
  );

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Clients', path: '/admin/clients' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Clients</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAddClient}>
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
                placeholder="Search clients by name, email, or phone"
                animated={true}
              />
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol size="12">
              <IonButton expand="block" color="primary" onClick={handleAddClient}>
                <IonIcon icon={addOutline} slot="start" />
                Add New Client
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow>
            {filteredClients.map(client => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={client.id}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={personOutline} /> {client.full_name}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList lines="none">
                      <IonItem>
                        <IonIcon icon={mailOutline} slot="start" color="primary" />
                        <IonLabel>
                          <p>Email</p>
                          <h3>{client.email}</h3>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={callOutline} slot="start" color="success" />
                        <IonLabel>
                          <p>Phone</p>
                          <h3>{client.phone}</h3>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonIcon icon={homeOutline} slot="start" color="tertiary" />
                        <IonLabel>
                          <p>Address</p>
                          <h3>{client.address}</h3>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <p>Status</p>
                          <IonBadge color={client.status === 'active' ? 'success' : 'warning'}>
                            {client.status}
                          </IonBadge>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <p>Total Pets: {client.total_pets || 0}</p>
                          <p>Total Bookings: {client.total_bookings || 0}</p>
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          <p>Joined</p>
                          <p>{new Date(client.created_at).toLocaleDateString()}</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                    
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <IonButton 
                        expand="block" 
                        fill="outline" 
                        color="primary"
                        onClick={() => handleEditClient(client.id)}
                      >
                        <IonIcon icon={createOutline} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton 
                        expand="block" 
                        fill="outline" 
                        color="danger"
                        onClick={() => handleDeleteClient(client.id)}
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

          {filteredClients.length === 0 && (
            <IonRow>
              <IonCol size="12" className="ion-text-center">
                <p style={{ padding: '2rem', color: 'var(--ion-color-medium)' }}>
                  No clients found. {searchText && 'Try a different search term.'}
                </p>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
