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
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newClient, setNewClient] = useState('');

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Clients', path: '/admin/clients' }
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
          <IonButtons slot="end">
            <IonButton onClick={addClient}>
              <IonIcon icon={add} slot="start" />
              Add Client
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          <IonSearchbar value={searchText} onIonInput={handleSearch} placeholder='Search Clients' />
          <IonInput 
            value={newClient} 
            onIonChange={e => setNewClient(e.target.value)} 
            placeholder='Add Client Name'
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          />
          <IonList>
            {filteredClients.map(client => (
              <IonItem key={client.id}>
                <IonLabel>{client.name}</IonLabel>
                <IonButton fill='outline' color="danger" onClick={() => removeClient(client.id)}>Remove</IonButton>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
