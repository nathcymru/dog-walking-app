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
  IonInput,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

// Mock data for when API is unavailable
const MOCK_CLIENTS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '555-0103' },
];

const Clients = () => {
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [searchText, setSearchText] = useState('');
  const [newClient, setNewClient] = useState('');

  const breadcrumbs = [
    { path: '/admin', label: 'Admin' },
    { path: '/admin/clients', label: 'Clients' }
  ];

  useEffect(() => {
    // Try to fetch clients from API, but use mock data if unavailable
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setClients(data);
        }
      }
      // If fetch fails, keep using mock data
    } catch (error) {
      // Keep using mock data
      console.log('Using mock data for clients');
    }
  };

  const addClient = () => {
    if (!newClient.trim()) return;
    const id = clients.length + 1;
    const client = { id, name: newClient, email: '', phone: '' };
    setClients([...clients, client]);
    setNewClient('');
  };

  const removeClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clients</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbs} />
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <IonSearchbar 
                    value={searchText} 
                    onIonInput={handleSearch} 
                    placeholder="Search Clients" 
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <IonInput 
                      value={newClient} 
                      onIonChange={e => setNewClient(e.target.value)} 
                      placeholder="Add Client Name" 
                      style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <IonButton onClick={addClient}>Add Client</IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonList>
                {filteredClients.map(client => (
                  <IonItem key={client.id}>
                    <IonLabel>
                      <h2>{client.name}</h2>
                      {client.email && <p>{client.email}</p>}
                      {client.phone && <p>{client.phone}</p>}
                    </IonLabel>
                    <IonButton fill="outline" onClick={() => removeClient(client.id)}>
                      Remove
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
