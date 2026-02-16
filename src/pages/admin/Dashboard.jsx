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
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const breadcrumbs = [
    { path: '/admin', label: 'Admin' },
    { path: '/admin/dashboard', label: 'Dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Breadcrumbs items={breadcrumbs} />
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Total Walks</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>150</h2>
                  <p>Completed walks this month</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Dogs Walked</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>200</h2>
                  <p>Total dogs in service</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Active Walkers</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>15</h2>
                  <p>Walkers on duty today</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Latest Activity</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Walker John Doe walked Buddy on 2026-01-30</p>
                  <p>Walker Jane Smith walked Max on 2026-01-29</p>
                  <p>Walker Mike Johnson walked Lucy on 2026-01-29</p>
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