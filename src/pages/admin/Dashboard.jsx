import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonCard, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const Dashboard = () => {
    const history = useHistory();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        history.push('/');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Admin Dashboard</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonBreadcrumbs>
                        <IonBreadcrumb href="/">Home</IonBreadcrumb>
                        <IonBreadcrumb>Admin</IonBreadcrumb>
                        <IonBreadcrumb>Dashboard</IonBreadcrumb>
                    </IonBreadcrumbs>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>Statistics Overview</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p>Total Walks: 150</p>
                                    <p>Total Dogs Walked: 200</p>
                                    <p>Total Walkers: 15</p>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
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