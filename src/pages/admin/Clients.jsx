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
import IonBreadcrumbsNav from '../../components/IonBreadcrumbsNav';
import { homeOutline, peopleOutline } from 'ionicons/icons';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newClient, setNewClient] = useState('');

  const breadcrumbs = [
    { label: 'Home', path: '/admin', icon: homeOutline },
    { label: 'Clients', path: '/admin/clients', icon: peopleOutline }
  ];

  useEffect(() => {
    // Initially fetch clients from a data source
    fetchClients();
  }, []);

  const fetchClients = () => {
    // Fetch clients from an API or local storage
    // Example:
    // setClients([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]);
  };

  const addClient = () => {
    const id = clients.length + 1;
    const client = { id, name: newClient };
    setClients([...clients, client]);
    setNewClient('');
  };

  const removeClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredClients = clients.filter(client => client.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Clients</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbsNav items={breadcrumbs} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2">
              <IonCard>
                <IonCardContent>
                  <IonSearchbar value={searchText} onIonInput={handleSearch} placeholder='Search Clients' />
                  <IonInput value={newClient} onIonChange={e => setNewClient(e.target.value)} placeholder='Add Client' />
                  <IonButton onClick={addClient} expand="block" color="primary" style={{ marginTop: '1rem' }}>
                    Add Client
                  </IonButton>
                </IonCardContent>
              </IonCard>
              <IonList>
                {filteredClients.map(client => (
                  <IonItem key={client.id}>
                    <IonLabel>{client.name}</IonLabel>
                    <IonButton fill='outline' onClick={() => removeClient(client.id)}>Remove</IonButton>
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
