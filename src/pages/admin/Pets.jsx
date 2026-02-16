import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonList, 
  IonItem, 
  IonButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

// Mock data for when API is unavailable
const MOCK_PETS = [
  { id: 1, name: 'Buddy', breed: 'Golden Retriever', owner: 'John Doe', age: 3 },
  { id: 2, name: 'Max', breed: 'Labrador', owner: 'Jane Smith', age: 5 },
  { id: 3, name: 'Lucy', breed: 'Beagle', owner: 'Bob Wilson', age: 2 },
];

const Pets = () => {
  const [pets] = useState(MOCK_PETS);

  const breadcrumbs = [
    { path: '/admin', label: 'Admin' },
    { path: '/admin/pets', label: 'Pets' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbs} />
        <IonGrid className="ion-padding">
          <IonRow>
            {pets.map(pet => (
              <IonCol key={pet.id} size="12" sizeMd="6" sizeLg="4">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{pet.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="none">
                        <IonLabel>
                          <p><strong>Breed:</strong> {pet.breed}</p>
                          <p><strong>Owner:</strong> {pet.owner}</p>
                          <p><strong>Age:</strong> {pet.age} years</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                    <IonButton fill="outline" expand="block">Edit</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;