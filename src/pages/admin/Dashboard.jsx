import React from 'react';
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
  IonText
} from '@ionic/react';
import Breadcrumbs from '../../components/Breadcrumbs';

const Dashboard = () => {
    const breadcrumbItems = [
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
            <IonContent>
                <Breadcrumbs items={breadcrumbItems} />
                <IonGrid className="ion-padding">
                    <IonRow>
                        <IonCol size="12" sizeMd="6" sizeLg="4">
                            <IonCard color="light">
                                <IonCardHeader>
                                    <IonCardTitle color="primary">Statistics Overview</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonText>
                                        <p><strong>Total Walks:</strong> 150</p>
                                        <p><strong>Total Dogs Walked:</strong> 200</p>
                                        <p><strong>Total Walkers:</strong> 15</p>
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol size="12" sizeMd="6" sizeLg="4">
                            <IonCard color="light">
                                <IonCardHeader>
                                    <IonCardTitle color="success">Latest Activity</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonText>
                                        <p>Walker John Doe walked Buddy on 2026-01-30</p>
                                    </IonText>
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