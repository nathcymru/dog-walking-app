import React from 'react';
import { 
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonCard, 
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid, 
  IonRow, 
  IonCol 
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: 'Dashboard', path: '/admin/dashboard' }
    ];

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Admin Dashboard</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <Breadcrumbs items={breadcrumbItems} />
                <IonGrid>
                    <IonRow>
                        <IonCol size="12" sizeMd="4">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Statistics Overview</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p><strong>Total Walks:</strong> 150</p>
                                    <p><strong>Total Dogs Walked:</strong> 200</p>
                                    <p><strong>Total Walkers:</strong> 15</p>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd="8">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Latest Activity</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p>Walker John Doe walked Buddy on 2026-01-30</p>
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