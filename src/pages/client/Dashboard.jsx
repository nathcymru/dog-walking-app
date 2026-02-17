import React, { useState, useEffect } from 'react';
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
  IonSpinner,
} from '@ionic/react';
import { calendarOutline, pawOutline, receiptOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const [stats, setStats] = useState({
    upcomingBookings: '-',
    totalPets: '-',
    unpaidBalance: '-'
  });
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'Dashboard', path: '/client/dashboard' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch('/api/client/bookings', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Fetch pets
      const petsResponse = await fetch('/api/client/pets', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      // Fetch invoices
      const invoicesResponse = await fetch('/api/client/invoices', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      const newStats = { ...stats };

      // Process bookings
      if (bookingsResponse.ok) {
        const bookings = await bookingsResponse.json();
        if (Array.isArray(bookings)) {
          const now = new Date();
          const upcoming = bookings.filter(
            b => b.status === 'approved' && new Date(b.datetime_start) > now
          );
          newStats.upcomingBookings = upcoming.length;
        }
      }

      // Process pets
      if (petsResponse.ok) {
        const pets = await petsResponse.json();
        if (Array.isArray(pets)) {
          newStats.totalPets = pets.length;
        }
      }

      // Process invoices
      if (invoicesResponse.ok) {
        const invoices = await invoicesResponse.json();
        if (Array.isArray(invoices)) {
          const unpaid = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'part_paid');
          const balance = unpaid.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
          newStats.unpaidBalance = `£${balance.toFixed(2)}`;
        }
      }

      setStats(newStats);
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
                  {loading ? (
                    <IonSpinner />
                  ) : (
                    <>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.upcomingBookings}</p>
                      <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Upcoming walks</p>
                    </>
                  )}
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
                  {loading ? (
                    <IonSpinner />
                  ) : (
                    <>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.totalPets}</p>
                      <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Registered pets</p>
                    </>
                  )}
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
                  {loading ? (
                    <IonSpinner />
                  ) : (
                    <>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{stats.unpaidBalance}</p>
                      <p style={{ color: 'var(--ion-color-medium)', margin: '0 0 1rem 0' }}>Current balance</p>
                    </>
                  )}
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