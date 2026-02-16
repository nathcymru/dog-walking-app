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
} from '@ionic/react';
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
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar value={searchText} onIonInput={handleSearch} placeholder='Search Clients' />
        <IonInput value={newClient} onIonChange={e => setNewClient(e.target.value)} placeholder='Add Client' />
        <IonButton onClick={addClient}>Add Client</IonButton>
        <IonList>
          {filteredClients.map(client => (
            <IonItem key={client.id}>
              <IonLabel>{client.name}</IonLabel>
              <IonButton fill='outline' onClick={() => removeClient(client.id)}>Remove</IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
