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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { add } from 'ionicons/icons';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [newClient, setNewClient] = useState('');
  const history = useHistory();
  const { logout } = useAuth();

  useEffect(() => {
    // Initially fetch clients from a data source
    fetchClients();
  }, []);

  const fetchClients = () => {
    // Fetch clients from an API or local storage
    // Example:
    // setClients([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]);
  };

  const handleLogout = () => {
    logout();
    history.push('/');
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
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbs>
            <IonBreadcrumb href="/">Home</IonBreadcrumb>
            <IonBreadcrumb>Admin</IonBreadcrumb>
            <IonBreadcrumb>Clients</IonBreadcrumb>
          </IonBreadcrumbs>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <IonSearchbar value={searchText} onIonInput={handleSearch} placeholder='Search Clients' />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <IonInput 
                      value={newClient} 
                      onIonChange={e => setNewClient(e.target.value)} 
                      placeholder='Add Client Name'
                      style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
                    />
                    <IonButton onClick={addClient}>
                      <IonIcon icon={add} slot="start" />
                      Add
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {filteredClients.length === 0 ? (
                <IonCard>
                  <IonCardContent>
                    <p>No clients found. Add your first client!</p>
                  </IonCardContent>
                </IonCard>
              ) : (
                <IonList>
                  {filteredClients.map(client => (
                    <IonItem key={client.id}>
                      <IonLabel>{client.name}</IonLabel>
                      <IonButton fill='outline' color="danger" onClick={() => removeClient(client.id)}>Remove</IonButton>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
