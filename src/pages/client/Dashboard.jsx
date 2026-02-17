import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { calendarOutline, pawOutline, receiptOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'Dashboard', path: '/client/dashboard' }
  ];

  return (
    <IonPage>
      <AppHeader title="Your Dashboard" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-primary)' }} />
                    <IonCardTitle>Bookings</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>-</p>
                  <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Upcoming walks</p>
                  <IonButton expand="block" routerLink="/client/bookings" size="small">
                    View Bookings
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={pawOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-success)' }} />
                    <IonCardTitle>My Pets</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>-</p>
                  <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Registered pets</p>
                  <IonButton expand="block" routerLink="/client/pets" size="small">
                    View Pets
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={receiptOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-warning)' }} />
                    <IonCardTitle>Billing</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>£-</p>
                  <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Current balance</p>
                  <IonButton expand="block" routerLink="/client/billing" size="small">
                    View Invoices
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Welcome to PawWalkers</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Manage your pet care services, view booking history, and track invoices all in one place.</p>
                  <p>Use the navigation tabs below to access different sections of your account.</p>
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