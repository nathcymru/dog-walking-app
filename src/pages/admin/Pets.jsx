import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol 
} from '@ionic/react';
import IonBreadcrumbsNav from '../../components/IonBreadcrumbsNav';
import { homeOutline, pawOutline } from 'ionicons/icons';

const Pets = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/admin', icon: homeOutline },
    { label: 'Pets', path: '/admin/pets', icon: pawOutline }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Pets</IonTitle>
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
                <IonItem>
                  <IonLabel>
                    <h2>Pet 1</h2>
                  </IonLabel>
                  <IonButton fill="outline" color="primary">Edit</IonButton>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Pet 2</h2>
                  </IonLabel>
                  <IonButton fill="outline" color="primary">Edit</IonButton>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2>Pet 3</h2>
                  </IonLabel>
                  <IonButton fill="outline" color="primary">Edit</IonButton>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Pets;