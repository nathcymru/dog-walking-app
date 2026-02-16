import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
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
      <IonContent className="ion-padding">
        <Breadcrumbs items={breadcrumbItems} />
        <IonGrid>
          <IonRow>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Upcoming Walks</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>You have 3 walks scheduled this week</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Your Pets</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>2 pets registered</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size='12' sizeMd='6' sizeLg='4'>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Recent Activity</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Last walk: Yesterday at 3:00 PM</p>
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