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
  IonSpinner
} from '@ionic/react';
import { peopleOutline, pawOutline, calendarOutline, warningOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
    const [stats, setStats] = useState({
      totalClients: 0,
      totalPets: 0,
      bookingsThisMonth: 0,
      incidentsThisMonth: 0
    });
    const [loading, setLoading] = useState(true);

    const breadcrumbItems = [
        { label: 'Admin', path: '/admin' },
        { label: 'Dashboard', path: '/admin/dashboard' }
    ];

    useEffect(() => {
      fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalClients: data.totalClients ?? 0,
            totalPets: data.totalPets ?? 0,
            bookingsThisMonth: data.bookingsThisMonth ?? 0,
            incidentsThisMonth: data.incidentsThisMonth ?? 0
          });
        }
      } catch (error) {
        console.log('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
        <IonPage>
            <AppHeader title="Admin Dashboard" />
            <IonContent>
                <Breadcrumbs items={breadcrumbItems} />
                <IonGrid className="ion-padding">
                    <IonRow>
                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard>
                                <IonCardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <IonIcon icon={peopleOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-primary)' }} />
                                        <IonCardTitle>Clients</IonCardTitle>
                                    </div>
                                </IonCardHeader>
                                <IonCardContent>
                                    {loading ? (
                                      <IonSpinner />
                                    ) : (
                                      <>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.totalClients}</p>
                                        <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>Total Clients</p>
                                      </>
                                    )}
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard>
                                <IonCardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <IonIcon icon={pawOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-success)' }} />
                                        <IonCardTitle>Pets</IonCardTitle>
                                    </div>
                                </IonCardHeader>
                                <IonCardContent>
                                    {loading ? (
                                      <IonSpinner />
                                    ) : (
                                      <>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.totalPets}</p>
                                        <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>Total Pets</p>
                                      </>
                                    )}
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard>
                                <IonCardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <IonIcon icon={calendarOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-warning)' }} />
                                        <IonCardTitle>Bookings</IonCardTitle>
                                    </div>
                                </IonCardHeader>
                                <IonCardContent>
                                    {loading ? (
                                      <IonSpinner />
                                    ) : (
                                      <>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.bookingsThisMonth}</p>
                                        <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>This Month</p>
                                      </>
                                    )}
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd="6" sizeLg="3">
                            <IonCard>
                                <IonCardHeader>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <IonIcon icon={warningOutline} style={{ fontSize: '2rem', color: 'var(--ion-color-danger)' }} />
                                        <IonCardTitle>Incidents</IonCardTitle>
                                    </div>
                                </IonCardHeader>
                                <IonCardContent>
                                    {loading ? (
                                      <IonSpinner />
                                    ) : (
                                      <>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{stats.incidentsThisMonth}</p>
                                        <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>This Month</p>
                                      </>
                                    )}
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Quick Actions</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p>Use the navigation tabs below to manage clients, pets, bookings, and incidents.</p>
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