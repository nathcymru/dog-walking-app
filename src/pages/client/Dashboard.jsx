import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const Dashboard = () => {
  const history = useHistory();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Client Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>Logout</IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonBreadcrumbs>
            <IonBreadcrumb href="/">Home</IonBreadcrumb>
            <IonBreadcrumb>Client</IonBreadcrumb>
            <IonBreadcrumb>Dashboard</IonBreadcrumb>
          </IonBreadcrumbs>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
                  <p>2 pets registered in the system</p>
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