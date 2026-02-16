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
  IonCol 
} from '@ionic/react';
import IonBreadcrumbsNav from '../../components/IonBreadcrumbsNav';
import { homeOutline } from 'ionicons/icons';

const Dashboard = () => {
  const breadcrumbs = [
    { label: 'Home', path: '/admin', icon: homeOutline },
    { label: 'Dashboard', path: '/admin/dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbsNav items={breadcrumbs} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Statistics Overview</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Total Walks: 150</p>
                  <p>Total Dogs Walked: 200</p>
                  <p>Total Walkers: 15</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Latest Activity</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Walker John Doe walked Buddy on 2026-01-30</p>
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