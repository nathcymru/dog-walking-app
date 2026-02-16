import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonContent, 
  IonList, 
  IonItem, 
  IonButton, 
  IonTitle, 
  IonToolbar,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Pets = () => {
  const petsData = [
    { id: 1, name: "Rex", breed: "Golden Retriever", age: 5, weight: "30kg" },
    { id: 2, name: "Bella", breed: "Labrador", age: 3, weight: "25kg" },
  ];

  const breadcrumbs = [
    { path: '/client', label: 'Client' },
    { path: '/client/pets', label: 'Pets' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Pets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbs} />
        <IonGrid className="ion-padding">
          <IonRow>
            {petsData.map(pet => (
              <IonCol key={pet.id} size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{pet.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      <IonItem lines="none">
                        <IonLabel>
                          <p><strong>Breed:</strong> {pet.breed}</p>
                          <p><strong>Age:</strong> {pet.age} years</p>
                          <p><strong>Weight:</strong> {pet.weight}</p>
                        </IonLabel>
                      </IonItem>
                    </IonList>
                    <IonButton fill="outline" expand="block">Edit</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonButton expand="block">Add Pet</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;