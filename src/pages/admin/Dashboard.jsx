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
  IonIcon,
  IonBadge,
  IonButton,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { peopleOutline, pawOutline, calendarOutline, cashOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 15,
    totalPets: 25,
    totalBookings: 150,
    todayBookings: 8,
    upcomingBookings: 12,
    completedBookings: 130,
    activeIncidents: 2,
    revenue: '£4,250',
    activeWalkers: 5
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      // setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Dashboard', path: '/admin/dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <h2>Welcome to PawWalkers Admin</h2>
              <p>Overview of your dog walking business</p>
            </IonCol>
          </IonRow>

          {/* Statistics Cards */}
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="primary">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Total Clients</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{stats.totalClients}</h1>
                    </div>
                    <IonIcon icon={peopleOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/admin/clients" style={{ marginTop: '1rem' }}>
                    View All Clients
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="secondary">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Total Pets</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{stats.totalPets}</h1>
                    </div>
                    <IonIcon icon={pawOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/admin/pets" style={{ marginTop: '1rem' }}>
                    View All Pets
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="tertiary">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Total Bookings</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{stats.totalBookings}</h1>
                    </div>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/admin/bookings" style={{ marginTop: '1rem' }}>
                    View All Bookings
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="success">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Revenue</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{stats.revenue}</h1>
                    </div>
                    <IonIcon icon={cashOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <p style={{ margin: '1rem 0 0', color: 'white', fontSize: '0.9rem' }}>This month</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Today's Overview */}
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={calendarOutline} /> Today's Bookings
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem 0' }}>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ margin: 0, color: 'var(--ion-color-primary)' }}>{stats.todayBookings}</h2>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Today</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ margin: 0, color: 'var(--ion-color-warning)' }}>{stats.upcomingBookings}</h2>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Upcoming</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{ margin: 0, color: 'var(--ion-color-success)' }}>{stats.completedBookings}</h2>
                      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>Completed</p>
                    </div>
                  </div>
                  <IonButton expand="block" color="primary" routerLink="/admin/bookings">
                    Manage Bookings
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={alertCircleOutline} /> Active Incidents
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <h1 style={{ margin: 0, color: stats.activeIncidents > 0 ? 'var(--ion-color-danger)' : 'var(--ion-color-success)' }}>
                      {stats.activeIncidents}
                    </h1>
                    <p style={{ margin: '0.5rem 0' }}>
                      {stats.activeIncidents === 0 ? 'No active incidents' : 'incidents requiring attention'}
                    </p>
                    {stats.activeIncidents > 0 && (
                      <IonBadge color="danger" style={{ marginTop: '1rem' }}>
                        Requires Action
                      </IonBadge>
                    )}
                    {stats.activeIncidents === 0 && (
                      <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '48px', color: 'var(--ion-color-success)', marginTop: '1rem' }} />
                    )}
                  </div>
                  <IonButton expand="block" color={stats.activeIncidents > 0 ? 'danger' : 'primary'} routerLink="/admin/incidents">
                    View Incidents
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Quick Actions */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Quick Actions</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="primary" routerLink="/admin/clients">
                          <IonIcon icon={peopleOutline} slot="start" />
                          Manage Clients
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="secondary" routerLink="/admin/pets">
                          <IonIcon icon={pawOutline} slot="start" />
                          Manage Pets
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="tertiary" routerLink="/admin/bookings">
                          <IonIcon icon={calendarOutline} slot="start" />
                          Manage Bookings
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="danger" routerLink="/admin/incidents">
                          <IonIcon icon={alertCircleOutline} slot="start" />
                          View Incidents
                        </IonButton>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Recent Activity */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Recent Activity</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>New booking: Max - Solo Walk at 10:00 AM</p>
                  <p>Client registered: Sarah Johnson</p>
                  <p>Walk completed: Bella - Group Walk</p>
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