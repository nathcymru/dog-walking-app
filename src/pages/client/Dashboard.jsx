import React, { useState, useEffect } from 'react';
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
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { logOut, paw, calendar, cash } from 'ionicons/icons';
import { useAuth } from '../../utils/auth';
import { useHistory } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    totalPets: 0,
    nextWalk: null
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/client/dashboard', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        setRecentBookings(data.recentBookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Client', path: '/client' },
    { label: 'Dashboard' }
  ];

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="ion-text-center ion-padding">
            <IonSpinner color="primary" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOut} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonGrid>
          {/* Welcome Section */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Welcome back, {user?.name || 'Client'}!</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Here's what's happening with your pets and bookings.</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Stats Cards */}
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.upcomingBookings}</h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>Upcoming Bookings</p>
                    </div>
                    <IonIcon icon={calendar} style={{ fontSize: '3rem', color: 'var(--ion-color-success)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalPets}</h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>My Pets</p>
                    </div>
                    <IonIcon icon={paw} style={{ fontSize: '3rem', color: 'var(--ion-color-secondary)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard color="light">
                <IonCardContent>
                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--ion-color-medium)', fontSize: '0.875rem' }}>Next Walk</p>
                    {stats.nextWalk ? (
                      <>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                          {new Date(stats.nextWalk.datetime_start).toLocaleDateString()}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0' }}>
                          {new Date(stats.nextWalk.datetime_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </>
                    ) : (
                      <p>No upcoming walks</p>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Recent Bookings */}
          <IonRow>
            <IonCol size="12" sizeLg="8">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Recent Bookings</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {recentBookings.length === 0 ? (
                    <p>No recent bookings found.</p>
                  ) : (
                    <IonList>
                      {recentBookings.map((booking, index) => (
                        <IonItem key={index}>
                          <IonLabel>
                            <h3>{booking.pet_names}</h3>
                            <p>{booking.service_type}</p>
                            <p>{new Date(booking.datetime_start).toLocaleString()}</p>
                          </IonLabel>
                          <IonBadge 
                            color={
                              booking.status === 'approved' ? 'success' :
                              booking.status === 'pending' ? 'warning' :
                              booking.status === 'completed' ? 'medium' : 'danger'
                            } 
                            slot="end"
                          >
                            {booking.status}
                          </IonBadge>
                        </IonItem>
                      ))}
                    </IonList>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Quick Links */}
            <IonCol size="12" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Quick Links</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" routerLink="/client/bookings" color="primary">
                    <IonIcon icon={calendar} slot="start" />
                    My Bookings
                  </IonButton>
                  <IonButton expand="block" routerLink="/client/pets" color="secondary" style={{ marginTop: '0.5rem' }}>
                    <IonIcon icon={paw} slot="start" />
                    My Pets
                  </IonButton>
                  <IonButton expand="block" routerLink="/client/billing" color="tertiary" style={{ marginTop: '0.5rem' }}>
                    <IonIcon icon={cash} slot="start" />
                    Billing
                  </IonButton>
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