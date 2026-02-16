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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSpinner,
  IonIcon,
  IonBadge,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { logOut, people, paw, calendar, cash } from 'ionicons/icons';
import { useAuth } from '../../utils/auth';
import { useHistory } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    todayBookings: 0,
    monthlyRevenue: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        setTodaySchedule(data.todaySchedule || []);
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
    { label: 'Admin', path: '/admin' },
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
          <IonTitle>Admin Dashboard</IonTitle>
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
                  <IonCardTitle>Welcome back, {user?.name || 'Admin'}!</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Here's what's happening with your dog walking business today.</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Stats Cards */}
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalClients}</h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>Total Clients</p>
                    </div>
                    <IonIcon icon={people} style={{ fontSize: '3rem', color: 'var(--ion-color-primary)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalPets}</h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>Total Pets</p>
                    </div>
                    <IonIcon icon={paw} style={{ fontSize: '3rem', color: 'var(--ion-color-secondary)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{stats.todayBookings}</h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>Today's Bookings</p>
                    </div>
                    <IonIcon icon={calendar} style={{ fontSize: '3rem', color: 'var(--ion-color-success)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="light">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.monthlyRevenue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                      </h2>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--ion-color-medium)' }}>Monthly Revenue</p>
                    </div>
                    <IonIcon icon={cash} style={{ fontSize: '3rem', color: 'var(--ion-color-warning)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Today's Schedule */}
          <IonRow>
            <IonCol size="12" sizeLg="8">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Today's Schedule</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {todaySchedule.length === 0 ? (
                    <p>No bookings scheduled for today.</p>
                  ) : (
                    <IonList>
                      {todaySchedule.map((booking, index) => (
                        <IonItem key={index}>
                          <IonLabel>
                            <h3>{booking.client_name}</h3>
                            <p>{booking.pet_names}</p>
                            <p>{new Date(booking.datetime_start).toLocaleTimeString()} - {new Date(booking.datetime_end).toLocaleTimeString()}</p>
                          </IonLabel>
                          <IonBadge color="success" slot="end">{booking.service_type}</IonBadge>
                        </IonItem>
                      ))}
                    </IonList>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Quick Actions */}
            <IonCol size="12" sizeLg="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Quick Actions</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" routerLink="/admin/bookings" color="primary">
                    <IonIcon icon={calendar} slot="start" />
                    New Booking
                  </IonButton>
                  <IonButton expand="block" routerLink="/admin/clients" color="secondary" style={{ marginTop: '0.5rem' }}>
                    <IonIcon icon={people} slot="start" />
                    Add Client
                  </IonButton>
                  <IonButton expand="block" routerLink="/admin/pets" color="tertiary" style={{ marginTop: '0.5rem' }}>
                    <IonIcon icon={paw} slot="start" />
                    Add Pet
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