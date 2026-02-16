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
} from '@ionic/react';
import IonBreadcrumbsNav from '../../components/IonBreadcrumbsNav';
import { homeOutline } from 'ionicons/icons';

const Dashboard = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/client', icon: homeOutline },
    { label: 'Dashboard', path: '/client/dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Your Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbsNav items={breadcrumbs} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Card 1</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Content for Card 1</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Card 2</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Content for Card 2</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Card 3</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Content for Card 3</p>
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