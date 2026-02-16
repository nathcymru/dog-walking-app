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
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const breadcrumbs = [
    { path: '/client', label: 'Client' },
    { path: '/client/dashboard', label: 'Dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbs} />
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Upcoming Walks</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>3</h2>
                  <p>Scheduled this week</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Active Pets</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>2</h2>
                  <p>Registered pets</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Total Walks</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>45</h2>
                  <p>This month</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Recent Activity</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Last walk: Buddy - February 14, 2026</p>
                  <p>Next walk: Max - February 17, 2026</p>
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