import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'Dashboard', path: '/client/dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Your Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard color="light">
                <IonCardHeader>
                  <IonCardTitle color="primary">Card 1</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>Content for Card 1</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard color="light">
                <IonCardHeader>
                  <IonCardTitle color="success">Card 2</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>Content for Card 2</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard color="light">
                <IonCardHeader>
                  <IonCardTitle color="warning">Card 3</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>Content for Card 3</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;