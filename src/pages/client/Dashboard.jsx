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
  IonButton,
  IonBadge,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { pawOutline, calendarOutline, receiptOutline, alertCircleOutline } from 'ionicons/icons';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPets: 2,
    upcomingBookings: 3,
    completedBookings: 12,
    pendingPayments: 1,
    nextBooking: {
      date: '2026-02-18T10:00:00Z',
      service: 'Solo Walk',
      pet: 'Max',
      walker: 'Sarah Walker'
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // const response = await fetch('/api/client/dashboard');
      // const data = await response.json();
      // setDashboardData(data);
      // For now using demo data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Client', path: '/client' },
    { label: 'Dashboard', path: '/client/dashboard' }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>My Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <Breadcrumbs items={breadcrumbItems} />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <h2>Welcome to PawWalkers</h2>
              <p>Here's an overview of your account</p>
            </IonCol>
          </IonRow>

          {/* Quick Stats */}
          <IonRow>
            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="secondary">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>My Pets</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{dashboardData.totalPets}</h1>
                    </div>
                    <IonIcon icon={pawOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/client/pets" style={{ marginTop: '1rem' }}>
                    View Pets
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="tertiary">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Upcoming</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{dashboardData.upcomingBookings}</h1>
                    </div>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/client/bookings" style={{ marginTop: '1rem' }}>
                    View Bookings
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color="success">
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Completed</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{dashboardData.completedBookings}</h1>
                    </div>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <p style={{ margin: '1rem 0 0', color: 'white', fontSize: '0.9rem' }}>Total walks this year</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6" sizeLg="3">
              <IonCard color={dashboardData.pendingPayments > 0 ? 'warning' : 'success'}>
                <IonCardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'white' }}>Invoices</h3>
                      <h1 style={{ margin: '0.5rem 0', color: 'white' }}>{dashboardData.pendingPayments}</h1>
                    </div>
                    <IonIcon icon={receiptOutline} style={{ fontSize: '48px', color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <IonButton expand="block" fill="clear" color="light" routerLink="/client/billing" style={{ marginTop: '1rem' }}>
                    View Billing
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Next Booking */}
          {dashboardData.nextBooking && (
            <IonRow>
              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={calendarOutline} /> Next Booking
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <h3 style={{ marginTop: 0 }}>{dashboardData.nextBooking.service}</h3>
                    <p><strong>Date:</strong> {new Date(dashboardData.nextBooking.date).toLocaleString()}</p>
                    <p><strong>Pet:</strong> {dashboardData.nextBooking.pet}</p>
                    <p><strong>Walker:</strong> {dashboardData.nextBooking.walker}</p>
                    <IonButton expand="block" color="primary" routerLink="/client/bookings" style={{ marginTop: '1rem' }}>
                      View All Bookings
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={alertCircleOutline} /> Important Notes
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {dashboardData.pendingPayments > 0 ? (
                      <>
                        <IonBadge color="warning" style={{ marginBottom: '1rem' }}>
                          Payment Due
                        </IonBadge>
                        <p>You have {dashboardData.pendingPayments} unpaid invoice(s). Please review your billing section.</p>
                        <IonButton expand="block" color="warning" routerLink="/client/billing" style={{ marginTop: '1rem' }}>
                          Pay Now
                        </IonButton>
                      </>
                    ) : (
                      <>
                        <IonBadge color="success" style={{ marginBottom: '1rem' }}>
                          All Paid Up!
                        </IonBadge>
                        <p>Your account is in good standing. Thank you for being a valued client!</p>
                      </>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          )}

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
                        <IonButton expand="block" color="primary" routerLink="/client/bookings">
                          <IonIcon icon={calendarOutline} slot="start" />
                          Book a Walk
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="secondary" routerLink="/client/pets">
                          <IonIcon icon={pawOutline} slot="start" />
                          Manage Pets
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="tertiary" routerLink="/client/billing">
                          <IonIcon icon={receiptOutline} slot="start" />
                          View Invoices
                        </IonButton>
                      </IonCol>
                      <IonCol size="12" sizeMd="6" sizeLg="3">
                        <IonButton expand="block" color="success" href="/contact">
                          <IonIcon icon={alertCircleOutline} slot="start" />
                          Contact Us
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
                  <p>✅ Walk completed: Max - Solo Walk (Feb 15, 2026)</p>
                  <p>📅 Booking confirmed: Bella - Group Walk (Feb 20, 2026)</p>
                  <p>💳 Invoice paid: INV-001 (Feb 10, 2026)</p>
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