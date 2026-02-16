import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { peopleOutline, pawOutline, calendarOutline, warningOutline } from 'ionicons/icons';

const Dashboard = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Admin Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
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
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>-</p>
                                    <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>Total Clients</p>
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
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>-</p>
                                    <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>Total Pets</p>
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
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>-</p>
                                    <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>This Month</p>
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
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>-</p>
                                    <p style={{ color: 'var(--ion-color-medium)', margin: 0 }}>This Month</p>
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