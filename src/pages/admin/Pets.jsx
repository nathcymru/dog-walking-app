import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonList, 
  IonItem, 
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonLabel,
  IonCard,
  IonCardContent,
  IonGrid,
  IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { pencil } from 'ionicons/icons';

const Pets = () => {
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
                    <IonTitle>Pets</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonBreadcrumbs>
                        <IonBreadcrumb href="/">Home</IonBreadcrumb>
                        <IonBreadcrumb>Admin</IonBreadcrumb>
                        <IonBreadcrumb>Pets</IonBreadcrumb>
                    </IonBreadcrumbs>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 1</h2>
                            </IonLabel>
                            <IonButton fill="outline">
                                <IonIcon icon={pencil} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 2</h2>
                            </IonLabel>
                            <IonButton fill="outline">
                                <IonIcon icon={pencil} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h2>Pet 3</h2>
                            </IonLabel>
                            <IonButton fill="outline">
                                <IonIcon icon={pencil} slot="start" />
                                Edit
                            </IonButton>
                        </IonItem>
                    </IonList>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Pets;