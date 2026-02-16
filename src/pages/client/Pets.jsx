import React from 'react';
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
  IonGrid, 
  IonRow, 
  IonCol 
} from '@ionic/react';
import IonBreadcrumbsNav from '../../components/IonBreadcrumbsNav';
import { homeOutline, pawOutline } from 'ionicons/icons';

const Pets = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/client', icon: homeOutline },
    { label: 'My Pets', path: '/client/pets', icon: pawOutline }
  ];

  const petsData = [
    { id: 1, name: "Rex", breed: "Golden Retriever" },
    { id: 2, name: "Bella", breed: "Labrador" },
    // Add more pet data as needed
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Pets</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbsNav items={breadcrumbs} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8" offsetMd="2">
              <IonList>
                {petsData.map(pet => (
                  <IonItem key={pet.id}>
                    <IonLabel>
                      {pet.name} - {pet.breed}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
              <IonButton expand="block" color="primary">Add Pet</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;