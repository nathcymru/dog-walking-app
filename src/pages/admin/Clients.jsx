import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonSearchbar,
  IonInput,
  IonLabel,
} from '@ionic/react';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newClient, setNewClient] = useState('');

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
